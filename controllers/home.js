/**
 * GET /
 * Home page.
 */

exports.getIndex = function(req, res) {
	if (req.user) {
    return res.redirect('/manage');
  }
  res.render('home', {
    title: 'Welcome'
  });
};
