export const HTMLString = API_KEY => `
<!DOCTYPE html>
<html>
  <head>
    <title>Street View split-map-panes</title>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
    <script
      src="https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initPano&libraries=&v=weekly"
      defer
    ></script>
    <style>
        html, 
        body {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        #map,
        #pano {
          position:absolute;
          height: 100%;
          width: 100%;
        }
        #pano {
          z-index:200;
        }
        #map { 
          z-index:100;
        }
    
    </style>
  </head>
  <body>
    <div id="map"></div>
    <div id="pano"></div>
  </body>
</html>
`
