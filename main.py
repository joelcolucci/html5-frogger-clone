import os
import webapp2
import jinja2

from google.appengine.ext import db

file_dir = os.path.join(os.path.dirname(__file__))
jinja_env = jinja2.Environment(
  loader = jinja2.FileSystemLoader(file_dir), autoescape=True)

### Handlers ###
class MainPage(webapp2.RequestHandler):
  def get(self):
    # get top 5 scores
    highscores = HighScore.getTopFive()

    template = jinja_env.get_template('index.html')
    self.response.write(template.render(highscores = highscores))

  def post(self):
    #Get the parameters from the request
    initials = self.request.get('initials')
    location = self.request.get('location')
    score = self.request.get('score')

    #TODO: Validate form post

    #TODO: Post to datastore
    post = HighScore.newScore(initials, location, score)
    post.put()
    self.redirect('/')



### Data Models ###
class HighScore(db.Model):
  """datastore data model for HighScore"""
  initials = db.StringProperty(required = True)
  location = db.StringProperty(required = True)
  score = db.StringProperty(required = True)

  @classmethod
  def newScore(cls, initials, location, score):
    """ Return new HighScore entity """
    return HighScore(initials = initials, location = location, score = score)

  @classmethod
  def getTopFive(cls):
    """ Retrieve top 5 highscores """
    # Similar to line 317 of web dev
    #test = GqlQuery("SELECT * FROM HighScore ORDER BY score DESC LIMIT 5")
    q = HighScore.all()
    highscores = q.order('-score').fetch(limit=5)
    return highscores

### Utilities ###



application = webapp2.WSGIApplication([
  ('/', MainPage),
], debug=True)