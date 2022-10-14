function main() {
  const req = fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(response => response.json())
  .then(response => {
    graph(response)
  })

  const graph = (data) => {
    /*Formato de ticks (eje Y)*/
    const format = d3.timeFormat('%M:%S');
   
    /*Creación de Date Object a partir de los tiempos (minutos y segundos)*/
    const times = data.map(d => new Date(`1993 08 21, 00:${d.Time}`))

    /*Variables de ancho, alto y padding del canvas*/
    const w = 1000;
    const h = 550;
    const padding = 70;

    /*Objecto de etiquetas*/
    const labels = [{
      xRect: 900,
      yRect: 220,
      W: 18,
      H: 18,
      xLabel: 780,
      yLabel: 234,
      Label: 'No doping allegations', 
      Color: '#17E0B7'
    }, 
    {
      xRect: 900,
      yRect: 250,
      W: 18,
      H: 18,
      xLabel: 736,
      yLabel: 264,
      Label: 'Riders with doping allegations',
      Color: '#E6405E'
    }]
    
    /*Definción de escalas*/
    const xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.Year-1), d3.max(data, d => d.Year+1)])
    .range([padding, w - padding]);

    const yScale = d3.scaleTime()
    .domain([d3.max(times), d3.min(times)])
    .range([h, 2*padding])

    /*Tooltip*/
    const tooltip = d3.select('.grafico')
      .append('div')
      .attr('id','tooltip')
      .style("position", "absolute")
      .style("visibility", "hidden")

    /*Canvas*/
    const svg = d3.select('.grafico')
      .append('svg')
      .attr('width', w)
      .attr('height', h)

    /*Título y subtítulo*/
    d3.select('#title')
      .text('Doping in Professional Bicycle Racing')

    d3.select('#subtitle')
      .text("35 Fastest times up Alpe d'Huez")

    /*Definición de ejes*/
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format('d'))

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(format)

    /*Texto eje*/
    svg.append('text')
    .attr('class', 'axis-text')
    .attr('x', -215)
    .attr('y', 20)
    .attr('transform', 'rotate(-90)')
    .text('Time in Minutes')

    svg.append('text')
    .attr('class', 'axis-text')
    .attr('x', 890)
    .attr('y', 520)
    .text('Years')

    /*Graficado de ejes*/
    svg.append('g')
      .attr('id','x-axis')
      .attr('transform', `translate(0,${h - padding})`)
      .call(xAxis)

    svg.append('g')
      .attr('id','y-axis')
      .attr('transform', `translate(${padding},${-padding})`)
      .call(yAxis)
  
    /*Graficado de etiquetas*/
    svg.append('g')
      .attr('id','legend')
      .selectAll('.legend-label')
      .data(labels)
      .join((enter) => {
        let g = enter;

        g.append('g')
          .attr('class','legend-label')
          .append('rect')
          .attr('x', l => l.xRect)
          .attr('y', l => l.yRect)
          .attr('width', l => l.W)
          .attr('height', l => l.H)
          .attr('fill', l => l.Color)
      })

      svg.selectAll('.legend-label')
        .append('text')
        .attr('x', l => l.xLabel)
        .attr('y', l => l.yLabel)
        .text(l => l.Label)
      
    /*Graficado de puntos*/
    svg.append('g')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('data-xvalue', (d) => d.Year)
      .attr('data-yvalue', (d,i) => times[i])
      .attr('cx', (d) => xScale(d.Year))
      .attr('cy', (d,i) => yScale(times[i])-padding)
      .attr('r', 6)
      .attr('fill', (d) => (d.Doping === "" ? labels[0].Color : labels[1].Color))
      .on('click', (d) => {
        (d.target.__data__.URL !== '' ? window.open(d.target.__data__.URL) : '')
      })
      .on('mouseover', (d) => {
        tooltip.attr('data-year', d.target.__data__.Year)
          .style("visibility", "visible")
          .html(d.target.__data__.Name + ': ' + d.target.__data__.Nationality + '<br>' +
          'Year: ' + d.target.__data__.Year + ', Time: ' + d.target.__data__.Time + '<br>' +
          (d.target.__data__.Doping !== '' ? '<br>' + d.target.__data__.Doping : '' ))
      })
      .on("mousemove", (d) => {
        tooltip.style("top", (d.pageY-25)+"px").style("left",(d.pageX+25)+"px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
    });

  }
};