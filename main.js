var dbg;
var canvas;
var s;
var dot;

Snap.plugin(function(Snap, Element, Paper){
  Element.prototype.getLocalPoint = function(x, y) {
    var node = this.node;
    var svg = this.paper.node;
    var offset = svg.getBoundingClientRect();
    var { a, b, c, d, e, f } = node.getScreenCTM();
    var { left , top } = offset;
    return {
      x: (d * (x - e + left) - c * (y - f + top) ) / ( a*d - b*c ),
      y: (b * (x - e + left) - a * (y - f + top) ) / ( b*c - a*d )
    }
  };

  Element.prototype.getAbsolutePoint = function(x,y) {
    var node = this.node;
    var svg = this.paper.node;
    var offset = svg.getBoundingClientRect();
    var { a, b, c, d, e, f } = node.getScreenCTM();
    var { left , top } = offset;

    return {
      x: (a * x) + (c * y) + e - left,
      y: (b * x) + (d * y) + f - top
    };
  }

});

$(function(){
	s = Snap(650, 550);
  canvas = s.group();
  // var dot;
  $('#create').click(()=>{
    if(dot) {
      var { cx, cy } = dot.attr();
      var [x , y] = [cx, cy].map(i => parseInt(i));
      var p = dot.getAbsolutePoint(x,y);
      console.log(p);
      create(p.x, p.y);
    }
  });

  var create = (x, y) => {
    var pt = canvas.getLocalPoint(x, y);
    return canvas.circle(pt.x, pt.y, 3).attr({
      class: 'drawing',
      fill: 'blue'
    });
  };


  $('#create2').click(function(){
    if (dot) {
      var {cx, cy} = dot.attr();
      var [x,y] = [cx, cy].map(i => parseInt(i));
      // var cp = canvas.getCursorPoint(x,y);
      // console.log(pt);
      console.log('input:', {x, y});
      var pt = canvas.getLocalPoint(x,y);
      canvas.circle(pt.x, pt.y, 3)
        .attr({
          fill:'green',
          opacity: 0.5,
          class: 'debug'
        });

    }
  });
  s.paper.click(function(e) {
    // console.log('click', e);
    // create(e.offsetX, e.offsetY);
    var x = e.offsetX;
    var y = e.offsetY;
    if (e.target === node) {
      // var p = canvas.getAbsolutePoint(x , y);
      var p = paper.getAbsolutePoint(x, y);
      if (!dot) {

        dot = canvas.paper.circle(p.x, p.y, 3).attr({ 'fill' : 'red' });
      }
      else {
        dot.animate({
          cx: p.x,
          cy: p.y
        }, 100)
      }
    }
  });

  var node = s.paper.node;
  // console.log(node)
  s.paper.drag(function(dx, dy, x, y, e) {
    // console.log('move', e.target);
    if (e.target === node) {
      var ot = canvas.data('ot');
      canvas.attr({
        transform: ot + (ot ? 'T' : 't') + [dx, dy]
      });
      e.stopPropagation();
    }
  },
  function(x, y, e) {
    // console.log('start', e.target);
    if (e.target === node) {
      canvas.data('ot', canvas.transform().local);
      e.stopPropagation();
    }
  }, function(e){
    e.stopPropagation();
    // e.cancelBubble = true;
  });

  dbg = {
    mark(pt) {
      canvas.paper.circle(pt.x, pt.y, 3)
        .attr({
          fill: 'red',
          opacity: 0.5,
          class: 'debug'
        })
    },

    clear() {
      canvas.paper.selectAll('.debug').forEach(el => el.remove());
    },

    markRect(svgRect) {
      console.log(svgRect);
      canvas.paper.rect(svgRect.x, svgRect.y, svgRect.width, svgRect.height)
        .attr({
          fill:'none',
          stroke: 'black',
          'stroke-dasharray': '5 5',
          class: 'debug'
        })
    },

    markEl(el) {
      var bbox = el.getBBox();
      console.log(bbox);
      this.markRect(bbox);
    }
  };

  create(100, 200);
  create(200,100);
  create(300,150);

  canvas.paper.addMouseWheelHandler();
  var paper = canvas.paper;
});

function makeAbsoluteContext(element, svgDocument) {
  return function(x,y) {
    var offset = svgDocument.getBoundingClientRect();
    var matrix = element.getScreenCTM();
    return {
      x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
      y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
    };
  };
}
