npm run-script prod
cp public/app.css static/our_static/css/
cp public/app.css.map static/our_static/css/
cp public/*.js static/our_static/js/
cp public/*.js.map static/our_static/js/
python manage.py runserver
