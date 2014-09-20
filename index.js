var width = 960,
    height = 960;
    fill = d3.scale.category20();

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-500)
    .linkDistance(300)
    .size([width, height]);

var fade = function(opacity) {
  return function(d, i) {
    ////

    // d is the node object, i is the id, which matches correctly with node obj
    //fade all non-linked lines
    svg.selectAll("circle, line").style("opacity", opacity);
    //console.log(i);
    // get associated links
    var relatedLinks = svg.selectAll("line").filter(function(d) {
      // now d refers to link d
      // i refers to node id that is being hovered over.
      if (d.source.id == i || d.target.id == i) {
        //console.log("yo");
        return true;
      } else {
        return false;
      }
      //return d.source.id == i || d.target.id == i;
    });
    //console.log(relatedLinks)

    relatedLinks.each(function(linkData, iLink) {

        d3.select(this).style("opacity", 1);
        console.log(this);
        console.log(linkData.source);
        // d3.select(linkData.target);
    });
  };
};

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("pairData.json", function(error, graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      //.attr("class", function(d) { return d.name; })
      .attr("cy", 300)
      .attr("r", 25)
      .style("fill", function(d) { return fill(d.id); })
      .call(force.drag)
      .on("mouseover", fade(.1)).on("mouseout", fade(1));

  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
});



