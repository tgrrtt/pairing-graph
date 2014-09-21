var w = 960,
  h = 960,
  r = 20,
  fill = d3.scale.category20();

var force = d3.layout.force().charge(-500).linkDistance(300).size([w, h]);

var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

d3.json("pairData.json", function(data) {

  var json = data;

  var link = svg.selectAll("line")
    .data(json.links).enter()
    .append("line");

  var node = svg.selectAll(".node")
    .data(json.nodes).enter()
    .append("g").attr("class", "node")
    .style("fill", function(d) {
      return fill(d.id);
    })
    .call(force.drag).on("mouseover", fade(.1)).on("mouseout", fade(1));

  node.append("svg:image")
      .attr("xlink:href", function(d) { return "Images/"+d.name+"png" })
      .attr("x", -15)
      .attr("y", -15)
      .attr("width", 40)
      .attr("height", 40);

  //Names appended to nodes 

  node.append("text")
      .attr("dx", 30)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

  force.nodes(json.nodes).links(json.links).on("tick", tick).start();

   

  var linkedByIndex = {};
  json.links.forEach(function(d) {
      linkedByIndex[d.source.index + "," + d.target.index] = 1;
  });

  function isConnected(a, b) {
      return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
  }

  function tick() {
      node.attr("cx", function(d) {
          return d.x = Math.max(r, Math.min(w - r, d.x));
      }).attr("cy", function(d) {
          return d.y = Math.max(r, Math.min(h - r, d.y));
      }).attr("transform", function(d) {
           return "translate(" + d.x + "," + d.y + ")"; });

      link.attr("x1", function(d) {
          return d.source.x;
      }).attr("y1", function(d) {
          return d.source.y;
      }).attr("x2", function(d) {
          return d.target.x;
      }).attr("y2", function(d) {
          return d.target.y;
      });
  }

 

  function fade(opacity) {
      return function(d) {
          node.style("stroke-opacity", function(o) {
              thisOpacity = isConnected(d, o) ? 1 : opacity;
              this.setAttribute('opacity', thisOpacity);
              return thisOpacity;
          });

          link.style("stroke-opacity", function(o) {
              return o.source === d || o.target === d ? 1 : opacity;
          });
      };
  }
});