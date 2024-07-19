
d3.csv("https://flunky.github.io/cars2017.csv").then(data => {
    data.forEach(d => {
        d.AverageCityMPG = +d.AverageCityMPG;
        d.AverageHighwayMPG = +d.AverageHighwayMPG;
        d.EngineCylinders = +d.EngineCylinders;
    });

    function drawPlot(cylinderFilter) {
        const filteredData = data.filter(d => cylinderFilter.includes(d.EngineCylinders));

        d3.select("#chart").html("");

        const width = 500;
        const height = 500;
        const margin = {top: 10, right: 30, bottom: 60, left: 60};

        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const x = d3.scaleLog().base(10).domain([10, 150]).range([0, width]);
        const y = d3.scaleLog().base(10).domain([10, 150]).range([height, 0]);
        const r = d3.scaleLinear().domain([0, 12]).range([2, 10]);

        const xAxis = d3.axisBottom(x).tickValues([10, 20, 50, 100]).tickFormat(d3.format("~s"));
        const yAxis = d3.axisLeft(y).tickValues([10, 20, 50, 100]).tickFormat(d3.format("~s"));

        svg.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);
        svg.append("g").call(yAxis);

        svg.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
            .style("text-anchor", "middle")
            .text("Average City MPG");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Average Highway MPG");

        svg.selectAll("circle")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.AverageCityMPG))
            .attr("cy", d => y(d.AverageHighwayMPG))
            .attr("r", d => r(d.EngineCylinders))
            .style("fill", "gray");


        if (cylinderFilter.length === 1 && cylinderFilter[0] === 12) {
            const annotations = [
                {
                    note: {
                        label: "Cars with high number of engine cylinders have poor MPG",
                    },
                    x: x(15),
                    y: y(20),
                    dy: -100,
                    dx: 100
                },
            ];

            const makeAnnotations = d3.annotation()
                .annotations(annotations);

            svg.append("g")
                .call(makeAnnotations);
        }

        if (cylinderFilter.length === 4) {
            const annotations = [
                {
                    note: {
                        label: "There is a general trend that less engine cylinders lead to higher MPG",
                    },
                    x: x(25),
                    y: y(25),
                    dy: 70,
                    dx: 70
                },
            ];

            const makeAnnotations = d3.annotation()
                .annotations(annotations);

            svg.append("g")
                .call(makeAnnotations);
        }

        if (cylinderFilter.length === 1 && cylinderFilter[0] === 0) {
            const annotations = [
                {
                    note: {
                        label: "The highest MPG cars all have 0 cylinders",
                    },
                    x: x(100),
                    y: y(80),
                    dy: 100,
                    dx: -100
                },
            ];

            const makeAnnotations = d3.annotation()
                .annotations(annotations);

            svg.append("g")
                .call(makeAnnotations);
        }


    }

    cylinderFilters = [[12], [10, 8, 4, 6], [0]];
    cylinderFilterInd = 0;
    let cylinderFilter = cylinderFilters[cylinderFilterInd];
    drawPlot(cylinderFilter);

    const button = document.createElement("button");
    button.textContent = "Next";
    button.style.display = "block"; 
    button.style.margin = "0 auto"; 
    document.body.appendChild(button);

    button.addEventListener("click", () => {
        cylinderFilterInd = cylinderFilterInd + 1
        cylinderFilter = cylinderFilters[cylinderFilterInd];
        drawPlot(cylinderFilter);

        if (cylinderFilterInd == 2) { 
            buttons.forEach(button => {
                button.style.display = "block"; 
            });

            button.remove();
        }
        
    });


    cylinderFiltersExplore = [[0], [4], [6], [8], [10], [12], [0, 4, 6, 8, 10, 12]];


    const buttons = cylinderFiltersExplore.map(cylinderValue => {
        const button = document.createElement("button");
        text = cylinderValue.length > 1 ? "All cylinders" : `${cylinderValue[0]} cylinders`;
        button.textContent = `${text}`;
        button.style.margin = "0 auto"; 
        button.style.display = "none"; 


        document.body.appendChild(button);

        button.addEventListener("click", () => {
            drawPlot(cylinderValue);
        });

        return button;
    });

    const title = document.createElement("h1");
    title.textContent = "Relationship of engine cylinders to MPG";
    title.style.textAlign = "center"; 
    document.body.insertBefore(title, document.body.firstChild); 
});