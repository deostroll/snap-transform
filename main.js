var dbg;
var canvas;
var s;
$(function(){
	s = Snap(650, 550);
  canvas = s.group();
  var dot;
  $('#create').click(()=>{
    if(dot) {
      var { cx, cy } = dot.attr();
      var [x , y] = [cx, cy].map(i => parseInt(i));
      create(x, y);
    }
  });

  var create = (x, y) => {

    return canvas.circle(x, y, 3).attr({
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
      var pt = canvas.globalToLocal(canvas.createPoint(x,y));
      console.log(pt);
      console.log(canvas.getTransformedBB());
      // console.log(canvas.transformedBoundingBox());
      var svgRect = canvas.transformedBoundingBox();
      var bbox = canvas.getBBox();
      dbg.markRect(bbox);
      // dbg.markRect(svgRect);
      canvas.circle(pt.x, pt.y, 3)
        .attr({
          class: 'debug',
          fill: 'green',
          opacity: 0.5
        })
    }
  });
  s.paper.click(function(e) {
    // console.log('click', e);
    // create(e.offsetX, e.offsetY);
    var x = e.offsetX;
    var y = e.offsetY;
    if (e.target === node) {
      if (!dot) {
        dot = canvas.paper.circle(x, y, 3).attr({ 'fill' : 'red' });
      }
      else {
        dot.animate({
          cx: x,
          cy: y
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
      canvas.paper.rect(svgRect.x, svgRect.y, svgRect.width, svgRect.height)
        .attr({
          fill:'none',
          stroke: 'black',
          'stroke-dasharray': '5 5',
          class: 'debug'
        })
    }
  };



});
