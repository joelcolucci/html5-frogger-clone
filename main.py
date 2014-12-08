import os
import webapp2
import jinja2
import json

import logging

from google.appengine.ext import db

file_dir = os.path.join(os.path.dirname(__file__))
jinja_env = jinja2.Environment(
  loader = jinja2.FileSystemLoader(file_dir), autoescape=True)

### Handlers ###
class MainPage(webapp2.RequestHandler):
  def get(self):
    #highscores = HighScore.getTopFive()
    template = jinja_env.get_template('index.html')
    self.response.write(template.render())
    


class JsonHandler(webapp2.RequestHandler):
  #SOURCE: Udacity Course: Web Dev - Lesson 5
  def get(self):
    return self.getHighScoresAsJson()

  def post(self):
    #Get the parameters from the request
    self.initials = self.request.get('initials')
    self.location = self.request.get('location')
    self.score = self.request.get('score')

    params = dict(initials = self.initials,
            location = self.location,
            score = self.score)

    have_error = False

    if not Validator.valid_initals(self.initials):
      have_error = True
      params['error_initials'] = "Invalid initials! Max: 3 char"

    if not Validator.valid_location(self.location):
      have_error = True
      params['error_location'] = "Invalid location! Max: 20 char"
    
    if not Validator.valid_score(self.score):
      have_error = True
      params['error_score'] = "Invalid score!"

    if have_error:
      params['has_error'] = True
      return self.render_json(params)

    #Post to datastore
    post = HighScore.newScore(initials, location, score)
    post.put()

    return self.getHighScoresAsJson()

  def getHighScoresAsJson(self):
    highscores = HighScore.getTopFive()
    #Serve as JSON
    return self.render_json([s.as_dict() for s in highscores])

  #SOURCE: Udacity Course: Web Dev - Lesson 5
  def render_json(self, d):
    json_txt = json.dumps(d)
    self.response.headers['Content-Type'] = 'application/json; charset=UTF-8'
    self.response.write(json_txt)





### Data Models ###
class HighScore(db.Model):
  """datastore data model for HighScore"""
  initials = db.StringProperty(required = True)
  location = db.StringProperty(required = True)
  score = db.IntegerProperty(required = True)

  @classmethod
  def newScore(cls, initials, location, score):
    """ Return new HighScore entity """
    return HighScore(initials = initials, location = location, score = score)

  @classmethod
  def getTopFive(cls):
    """ Retrieve top 5 highscores """
    q = HighScore.all()
    highscores = q.order('-score').fetch(limit=5)
    # db.delete(q)

    return highscores

  #SOURCE: Udacity Course: Web Dev - Lesson 5
  def as_dict(self):
    d = {'initials': self.initials,
         'location': self.location,
         'score': self.score
    }
    return d





### Utilities ###
class Validator:
  """Contains methods to validate form input through use of regex
  """
  initals_re = re.compile(r'^[a-zA-Z]{1,3}$')
  location_re = re.compile(r'^[a-zA-Z]{1,20}$')
  score_re = re.compile(r'^[0-9]{1,20}$')

  @classmethod
  def valid_initials(cls, initials):
    """checks that initials exists and if it matches acceptable regex"""
    return initials and cls.initials_re.match(initials)

  @classmethod
  def valid_location(cls, location):
    """checks that location exists and if it matches acceptable regex"""
    return location and cls.location_re.match(location)

  @classmethod
  def valid_score(cls, score):
    """checks if score exists, if it does, it checks if it matches regex"""
    return score or cls.score_re.match(score)





application = webapp2.WSGIApplication([
  ('/', MainPage),
  ('/json', JsonHandler)
], debug=True)