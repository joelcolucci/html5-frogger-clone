import os
import webapp2
import jinja2

file_dir = os.path.join(os.path.dirname(__file__))
jinja_env = jinja2.Environment(
  loader = jinja2.FileSystemLoader(file_dir), autoescape=True)

class MainPage(webapp2.RequestHandler):
  def get(self):
    template = jinja_env.get_template('index.html')
    self.response.write(template.render())


application = webapp2.WSGIApplication([
  ('/', MainPage),
], debug=True)