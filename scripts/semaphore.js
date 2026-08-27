(function () {
  "use strict";

  function endpoint(angle, length, originX, originY) {
    var actualLength = length || 38;
    var radians = (angle * Math.PI) / 180;
    var baseX = typeof originX === "number" ? originX : 50;
    var baseY = typeof originY === "number" ? originY : 54;

    return {
      x: baseX + Math.sin(radians) * actualLength,
      y: baseY - Math.cos(radians) * actualLength
    };
  }

  function getSemaphoreColors() {
    var theme =
      document.documentElement.getAttribute("data-theme") || "dark";

    if (theme === "light") {
      return {
        body: "#000000",
        limb: "#000000"
      };
    }

    return {
      body: "#ffffff",
      limb: "#ffffff"
    };
  }

  function flagPolygon(point, angle) {
    return [
      '<g transform="translate(',
      point.x,
      " ",
      point.y,
      ") rotate(",
      angle,
      ')">',
      '<rect x="-1.5" y="-2.5" width="3" height="13"',
      ' rx="1.2" fill="#d9e1f5"></rect>',
      '<rect x="1" y="-5" width="12" height="12"',
      ' rx="1.8" fill="#f5bf3c" stroke="#f8f0d0" stroke-width="0.8"></rect>',
      '<polygon points="1,-5 13,-5 1,7" fill="#f06a57"></polygon>',
      '<line x1="1.8" y1="-4.2" x2="12.2" y2="6.2"',
      ' stroke="rgba(255,255,255,0.34)" stroke-width="0.8"></line>',
      "</g>"
    ].join("");
  }

  function renderSemaphoreFigure(position, label) {
    var leftShoulder = { x: 44, y: 42 };
    var rightShoulder = { x: 56, y: 42 };
    var colors = getSemaphoreColors();
    var leftHand = endpoint(
      position.left,
      36,
      leftShoulder.x,
      leftShoulder.y
    );
    var rightHand = endpoint(
      position.right,
      36,
      rightShoulder.x,
      rightShoulder.y
    );

    return [
      '<svg viewBox="0 0 100 108" role="img" aria-label="Semaphore ',
      label || "",
      '">',
      '<circle cx="50" cy="22" r="6.5" fill="',
      colors.body,
      '"></circle>',
      '<rect x="44" y="30" width="12" height="34" rx="4"',
      ' fill="',
      colors.body,
      '"></rect>',
      '<line x1="48" y1="64" x2="42" y2="97"',
      ' stroke="',
      colors.limb,
      '" stroke-width="5" stroke-linecap="round"></line>',
      '<line x1="52" y1="64" x2="58" y2="97"',
      ' stroke="',
      colors.limb,
      '" stroke-width="5" stroke-linecap="round"></line>',
      '<line x1="',
      leftShoulder.x,
      '" y1="',
      leftShoulder.y,
      '" x2="',
      leftHand.x,
      '" y2="',
      leftHand.y,
      '" stroke="',
      colors.limb,
      '" stroke-width="5" stroke-linecap="round"></line>',
      '<line x1="',
      rightShoulder.x,
      '" y1="',
      rightShoulder.y,
      '" x2="',
      rightHand.x,
      '" y2="',
      rightHand.y,
      '" stroke="',
      colors.limb,
      '" stroke-width="5" stroke-linecap="round"></line>',
      flagPolygon(leftHand, position.left),
      flagPolygon(rightHand, position.right),
      "</svg>"
    ].join("");
  }

  window.SignalTrainer = window.SignalTrainer || {};
  window.SignalTrainer.semaphore = {
    renderSemaphoreFigure: renderSemaphoreFigure
  };
})();
