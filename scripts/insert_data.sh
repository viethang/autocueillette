#!/bin/sh
psql -Uacuser -h localhost autocueillette_db <<EOF
INSERT INTO farm VALUES (
  default,
  'La ferme du grand Lausanne',
  '+41 78 634 98 53',
  'Chemin des eglantines',
  'Lausanne',
  'VD',
  'Switzerland',
  'haricot noisette cacaouette',
  ST_SetSRID(ST_Point(46.519833, 6.6335),4326)::geography,
  46.519833, 
  6.6335,
  'Guillaume',
  TIMESTAMP '2015-10-02 23:05:54'
);

INSERT INTO farm VALUES (
  default,
  'La ferme du grand Renens',
  '+41 78 634 98 57',
  'Route des ecrevisses rouges',
  'Renens',
  'VD',
  'Switzerland',
  'haricot salade fraise',
  ST_SetSRID(ST_Point(46.533333, 6.583333),4326)::geography,
  46.533333,
  6.583333,
  'Guillaume',
  TIMESTAMP '2015-10-03 09:16:34'
);

INSERT INTO farm VALUES (
  default,
  'La ferme du grand Gourmand',
  '+41 78 634 98 47',
  'Route Cantonale',
  'Saint-Sulpice',
  'VD',
  'Switzerland',
  'haricot salade courge tomate basilic',
  ST_SetSRID(ST_Point(46.516667, 6.566667),4326)::geography,
  46.516667,
  6.566667,
  'Viethang',
  TIMESTAMP '2015-10-03 09:21:34'
);

EOF
