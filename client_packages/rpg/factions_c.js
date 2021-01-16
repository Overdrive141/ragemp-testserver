// ARREST

mp.labels.new(
  "/arrest [id] [minutes]",
  new mp.Vector3(
    1690.6998291015625,
    2591.274169921875,
    45.91438674926758 + 0.5
  ),
  { los: true, font: 0, drawDistance: 15 }
); // z+0.5
mp.markers.new(
  1,
  new mp.Vector3(
    1690.6998291015625,
    2591.274169921875,
    45.91438674926758 - 1.0
  ),
  1,
  { color: [134, 64, 108, 255] }
); //z-1.0

mp.blips.new(
  419,
  new mp.Vector3(232.89617919921875, -410.9369201660156, 48.111934661865234),
  { name: "City Hall", color: 4, shortRange: true, scale: 1.0 }
);
// FACTION JOIN TEST
var joinMarkerPos = [];
joinMarkerPos[1] = [
  210.81883239746094,
  -405.72991943359375,
  48.076725006103516,
  "City Hall",
];
mp.markers.new(
  1,
  new mp.Vector3(
    joinMarkerPos[1][0],
    joinMarkerPos[1][1],
    joinMarkerPos[1][2] - 1.0
  ),
  1,
  { color: [134, 64, 108, 255] }
);
mp.labels.new(
  'Join the "' + joinMarkerPos[1][3] + '"',
  new mp.Vector3(
    joinMarkerPos[1][0],
    joinMarkerPos[1][1],
    joinMarkerPos[1][2] + 0.5
  ),
  { los: true, font: 0, drawDistance: 15 }
); // z+0.5

var factionsInfoPos = [
  229.13644409179688,
  -429.146240234375,
  48.076778411865234,
];

mp.markers.new(
  1,
  new mp.Vector3(
    factionsInfoPos[0],
    factionsInfoPos[1],
    factionsInfoPos[2] - 1.0
  ),
  1,
  { color: [134, 64, 108, 255] }
);
mp.labels.new(
  "Information",
  new mp.Vector3(
    factionsInfoPos[0],
    factionsInfoPos[1],
    factionsInfoPos[2] + 0.5
  ),
  { los: true, font: 0, drawDistance: 15 }
); // z+0.5
mp.peds.new(
  mp.game.joaat("a_f_y_business_02"),
  new mp.Vector3(228.3964422607422, -430.459228515625, 48.076725006103516),
  340,
  0
);
