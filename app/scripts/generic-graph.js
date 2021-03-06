/**
 * The model of a generic graph
 * Uses a boole matrix, an incidence matrix, an adjacency list and an edge list for graph modeling in memory.
 * We are doing here visualization, given that we don't need to use a more time effective solution
 * Contains all the basic operations and algorithm of a generic graph or binary tree
 */
class GenericGraph {
    //Graph representations in memory
    booleMatrix = [];
    incidenceMatrix = [];
    adjacencyList = [];
    edgeList = [];
    algorithmOutput;

    /**
     * Initializes the representation tables
     * @param {number} [numberOfNodes] Number of nodes in the graph
     * @param {number} [numberOfEdges] Number of edges in the graph
     * @param {Object} [booleMatrix] Boole matrix representation
     * @param {Object} [incidenceMatrix] Incidence matrix representation
     * @param {Object} [adjacencyList] Adjacency list representation
     * @param {Object} [edgeList] Edge list representation
     */
    constructor(numberOfNodes = 0, numberOfEdges = 0, booleMatrix = [],
                incidenceMatrix = [], adjacencyList = [], edgeList = []) {
        this.numberOfNodes = numberOfNodes;
        this.numberOfEdges = numberOfEdges;
        this.booleMatrix = booleMatrix;
        this.incidenceMatrix = incidenceMatrix;
        this.adjacencyList = adjacencyList;
        this.edgeList = edgeList;
        this.resetAlgorithm();
        this.initRepresentationTables();
    }

    //1. Base operations
    /**
     * Adds a node to the graph in the memory
     * @param {string} indexOfNode The index of the actual added node
     */
    addNewNode(indexOfNode) {
        //Increment the number of nodes
        this.numberOfNodes++;

        //Adding new node to the boole matrix
        this.booleMatrix[indexOfNode] = [];

        //The incidence matrix is flipped so don't need to add new row

        //Adding a new node to the adjacency list
        this.adjacencyList[indexOfNode] = [];
    }

    /**
     * Adds the node to the representation tables in the DOM
     * @param {string} indexOfNode index of the node in table
     * @param {string} nodeValue Value of the node
     */
    addNodeToTable(indexOfNode, nodeValue) {


        //Boole matrix
        this.tblBooleMatrix.addRow(indexOfNode, nodeValue);
        this.tblBooleMatrix.addColumn(indexOfNode, nodeValue);

        //Incidence matrix
        this.tblIncidenceMatrix.addRow(indexOfNode, nodeValue);

        //Adjacency list
        this.tblAdjacencyList.addRow(indexOfNode, nodeValue);


    }

    /**
     * Adds a new edge to the graph
     * @param {Object} edge The actual edge we want to add
     */

    addNewEdge(edge) {
        //Check for the validity of the edge
        this.checkEdge(edge);

        //Increment number of edges
        this.numberOfEdges++;

        //Adding the edge to the boole matrix
        this.booleMatrix[edge.source][edge.target] = 1;

        //Adding the edge to the incidence matrix
        const incidenceMatrixEntry = [];
        incidenceMatrixEntry[edge.source] = 1;
        incidenceMatrixEntry[edge.target] = 1;
        this.incidenceMatrix.push(incidenceMatrixEntry);

        //Adding the edge to the adjacency list
        this.adjacencyList[edge.source].push(edge.target);

        //Adding the edge to the edge list
        this.edgeList.push(edge);

    }

    /**
     * Adds an edge to the representation tables in the DOM
     * @param {Object} edge The edge to add
     */
    addEdgeToTable(edge) {

        const source = edge.source;
        const target = edge.target;
        const sourceNode = $("div[id='" + source + "']");
        const targetNode = $("div[id='" + target + "']");

        //Boole matrix
        this.tblBooleMatrix.updateTable(source, target, '1');

        //Incidence matrix
        this.tblIncidenceMatrix.pushColumn(this.incidenceMatrix.length.toString());
        this.tblIncidenceMatrix.updateTable(source, this.incidenceMatrix.length.toString(), '1');
        this.tblIncidenceMatrix.updateTable(target, this.incidenceMatrix.length.toString(), '1');

        //Adjacency list
        this.tblAdjacencyList.pushElementToRow(source, target, VisualNode.getValueFromNode(targetNode));

        //Edge list
        this.tblEdgeList.pushRow((this.edgeList.length).toString());
        this.tblEdgeList.updateTable((this.edgeList.length).toString(), SOURCE, VisualNode.getValueFromNode(sourceNode));
        this.tblEdgeList.updateTable((this.edgeList.length).toString(), TARGET, VisualNode.getValueFromNode(targetNode));
        this.tblEdgeList.updateTable((this.edgeList.length).toString(), WEIGHT, '1');

    }

    /**
     * Removes a node from the graph
     * @param {string} indexOfNode The index of the node we want to remove
     */
    removeNode(indexOfNode) {
        this.isolateNode(indexOfNode);

        //Decrement the number of nodes
        this.numberOfEdges--;

        //Remove it from the boole matrix
        delete this.booleMatrix[indexOfNode];

        //Remove it from the incidence matrix
        delete this.incidenceMatrix[indexOfNode];

        //Remove it from the adjacency list
        delete this.adjacencyList[indexOfNode];

        //Remove the node from the representation tables
        this.removeNodeFromTable(indexOfNode);

    }

    /**
     * Removes a given node from the representation tables
     * @param {string} indexOfNode Index of the node to remove from the representation tables
     */
    removeNodeFromTable(indexOfNode) {
        //Boole matrix
        this.tblBooleMatrix.removeRow(indexOfNode);
        this.tblBooleMatrix.removeColumn(indexOfNode);

        //Incidence matrix
        this.tblIncidenceMatrix.removeRow(indexOfNode);

        //Adjacency list
        this.tblAdjacencyList.removeRow(indexOfNode);

    }

    /**
     * Removes a new edge to the graph
     * @param {Object} edge The actual edge we want to remove
     * @param {string} [indexOfEdge] If the index of the edge is known, searching for it isn't necessary
     */

    removeEdge(edge, indexOfEdge = null) {
        //Check for the validity of the edge
        this.checkEdge(edge);

        //Decrement the number of edge
        this.numberOfEdges--;

        //Remove from the edge list
        if (indexOfEdge === null) {
            indexOfEdge = this.searchEdge(edge);
        }
        delete this.edgeList[indexOfEdge];

        //Remove from the boole matrix
        delete this.booleMatrix[edge.source][edge.target];

        //Remove from the incidence matrix
        delete this.incidenceMatrix[indexOfEdge];

        //Remove from the adjacency list
        for (let i in this.adjacencyList[edge.source])
            if (this.adjacencyList[edge.source][i] === edge.target)
                delete this.adjacencyList[edge.source][i];

        this.removeEdgeFromTable(edge, indexOfEdge);

    }

    /**
     * Removes an edge from the representation tables
     * @param {Object} edge Edge to remove from the representation table
     * @param {string} indexOfEdge Index of the edge in the edge list
     */
    removeEdgeFromTable(edge, indexOfEdge) {
        //Boole matrix
        this.tblBooleMatrix.updateTable(edge.source, edge.target, '0');

        //Incidence matrix
        this.tblIncidenceMatrix.removeColumn((Number.parseInt(indexOfEdge) + 1).toString());

        //Adjacency list
        this.tblAdjacencyList.removeElement(edge.source, edge.target);

        //Edge list
        this.tblEdgeList.removeRow((Number.parseInt(indexOfEdge) + 1).toString());
    }

    /**
     * Updates the weight values in the representation tables
     * @param {Object} edge The edge we update in the tables with included weight value
     */
    updateWeightInTables(edge, indexOfEdge) {
        //Boole matrix
        this.tblBooleMatrix.updateTable(edge.source, edge.target, edge.weight);

        //Edge list
        indexOfEdge++;
        this.tblEdgeList.updateTable(indexOfEdge.toString(), WEIGHT, edge.weight.toString());
    }

    /**
     * Deletes the whole graph from the memory
     */
    deleteGraph() {
        for (let i in this.adjacencyList) {
            this.removeNode(i);
            this.visualNode.removeNode(i);
        }
        this.edgeList = [];
        this.incidenceMatrix = [];
    }

    /**
     * Clears the output of the last run algorithm
     */
    resetAlgorithm() {
        this.algorithmOutput = [];
        this.algorithmOutput.log = [];
    }

    /**
     * Removes all edges from a given node
     * @param {string} indexOfNode Index if the node to isolate
     */
    isolateNode(indexOfNode) {
        //Search in the edge list and removes the edges
        for (let i in this.edgeList) {
            if (this.edgeList[i].source === indexOfNode || this.edgeList[i].target === indexOfNode)
                this.removeEdge(this.edgeList[i], i);
        }

    }

    /**
     * Checking if the nodes of the edge exist
     * Only one representation check is necessary, because
     * the four representations are synchronized
     * @param {Object} edge Edge to check
     */
    checkEdge(edge) {
        if (typeof this.booleMatrix[edge.source] === "undefined")
            throw new Error("Node no. " + edge.source + "doesn't exist");
        if (typeof this.booleMatrix[edge.target] === "undefined")
            throw new Error("Node no. " + edge.target + "doesn't exist");
    }

    /**
     * Initializes the tables in the representation section
     */
    initRepresentationTables() {
        this.tblBooleMatrix = new TableHandler(ID_BOOLE_MATRIX, $.i18n("boolean-matrix"));
        this.tblIncidenceMatrix = new TableHandler(ID_INCIDENCE_MATRIX, $.i18n("incidence-matrix"));
        this.tblAdjacencyList = new TableHandler(ID_ADJACENCY_LIST, $.i18n("adjency-list"));
        this.tblEdgeList = new TableHandler(ID_EDGE_LIST, $.i18n("edge-list"));
        //Init Edge list
        this.tblEdgeList.addColumn(SOURCE, $.i18n("source"));
        this.tblEdgeList.addColumn(TARGET, $.i18n("target"));
        this.tblEdgeList.addColumn(WEIGHT, $.i18n("weight"), HIDDEN);
    }

    /**
     * Removes all the representation tables from the DOM
     */
    dropRepresentationTables() {
        this.tblBooleMatrix.drop();
        this.tblIncidenceMatrix.drop();
        this.tblAdjacencyList.drop();
        this.tblEdgeList.drop();
    }

    /**
     * Runs the selected algorithm and prepares the output for animation.
     * @param {string} algorithm The id of the algorithm
     */
    runAlgorithm(algorithm) {
        switch (algorithm) {
            case ID_DEPTH_FIRST_SEARCH:
                this.depthFirstSearch(this.visualNode.getSelectedNode);
                break;
            case ID_BREADTH_FIRST_SEARCH:
                this.breadthFirstSearch(this.visualNode.getSelectedNode);
                break;
            case ID_DIJKSTRA:
                this.dijkstra(this.visualNode.getSelectedNode);
                break;
            case ID_KRUSKAL:
                this.kruskal();
                break;
        }
    }

    /**
     * Searches for an edge in the edge list and returns its index
     * @param {Object} edge The actual edge we search for
     */
    searchEdge(edge) {
        let indexOfEdge;
        for (let i in this.edgeList) {
            if (this.edgeList[i].source === edge.source &&
                this.edgeList[i].target === edge.target)
                indexOfEdge = i;
        }
        return indexOfEdge;
    }

    /**
     * Checks whether all the weights are equal or not
     */
    checkWeights() {
        const firstWeight = 1;
        for (let i in this.edgeList) {
            if (this.edgeList[i].weight !== firstWeight)
                return true;
        }
        return false;
    }

    /**
     * It's a helper function for generating dijkstra algorithm output.
     * Finds the elements that are not in the second array but in the first array at the same position.
     * The first element in the result array will be the last equal element in the two arrays, same position.
     * @param {String[]} firstArray The first array to be compared
     * @param {String[]} secondArray The second array to be compared
     * @returns {String[]} resultArray The result of the comparison
     */
    findTheDifference(firstArray, secondArray) {
        let ok = 0;
        let resultArray = [];
        for (let i in secondArray) {
            if (firstArray[i] !== secondArray[i]) {
                if (ok === 0) {
                    resultArray.push(firstArray[i - 1]);
                    ok = 1;
                    resultArray.push(firstArray[i]);
                }
            }
            if (ok === 1)
                resultArray.push(firstArray[i]);
        }
        return resultArray;
    }

    //2. Basic Algorithms
    /**
     * Breadth First Search algorithm
     * @param {string} starterNode Id of the starter node
     */
    //Szélességi bejárás
    breadthFirstSearch(starterNode) {
        let firstElement = 0;
        let lastElement = 0;
        let node;
        let freq = [];
        let route = [];
        for (let i in this.adjacencyList)
            freq[i] = 0;

        route[0] = starterNode;
        freq[starterNode]++;

        this.algorithmOutput.push({
            from: null,
            to: starterNode,
        });
        this.algorithmOutput.log.push(VisualNode.getValueByNodeId(starterNode));
        while (firstElement <= lastElement) {
            node = route[firstElement];
            for (let i in this.adjacencyList[node])
                if (freq[this.adjacencyList[node][i]] === 0) {
                    route[++lastElement] = this.adjacencyList[node][i];
                    this.algorithmOutput.push({
                        from: node,
                        to: this.adjacencyList[node][i],
                    });
                    this.algorithmOutput.log.push(VisualNode.getValueByNodeId(this.adjacencyList[node][i]));
                    freq[this.adjacencyList[node][i]]++;
                }

            firstElement++;
        }
    }


    /**
     * Depth First Search algorithm
     * @param {string} starterNode Id of the starter node
     */
    //Mélységi bejárás
    depthFirstSearch(starterNode) {

        let firstElement = 0;
        let lastElement = 1;
        let node;
        let ok = 0;
        let freq = [];
        let stack = [];
        let route = [];


        route.length = this.numberOfNodes - 1;
        stack.length = this.numberOfNodes;

        for (let i in this.adjacencyList)
            freq[i] = 0;

        route.fill(0);
        route[0] = starterNode;
        freq[starterNode]++;
        stack[0] = starterNode;

        this.algorithmOutput.push({
            from: null,
            to: starterNode,
        });
        this.algorithmOutput.log.push(VisualNode.getValueByNodeId(starterNode));

        while (firstElement >= 0) {
            node = stack[firstElement];
            ok = 0;

            for (let i in this.adjacencyList[node])
                if (freq[this.adjacencyList[node][i]] === 0) {
                    ok = 1;
                    stack[++firstElement] = this.adjacencyList[node][i];
                    route[lastElement++] = this.adjacencyList[node][i];
                    this.algorithmOutput.push({
                        from: node,
                        to: this.adjacencyList[node][i],
                    });
                    this.algorithmOutput.log.push(VisualNode.getValueByNodeId(this.adjacencyList[node][i]));
                    freq[this.adjacencyList[node][i]]++;
                    break;
                }
            if (ok === 0) firstElement--;
        }
        return route;

    }

    /**
     * Dijkstra algorithm
     * @param {String} starterNode The node we start the algorithm from
     */

    dijkstra(starterNode) {
        let routeSizes = [], visitedNodes = [];
        let ok;
        let minimum;
        let k;
        let oldRoute = [];
        let routes = [];
        this.algorithmOutput.push({
            from: null,
            to: starterNode,
            log: VisualNode.getValueByNodeId(starterNode)
        });
        for (let i in this.booleMatrix) {
            if (this.booleMatrix[starterNode][i] > 0) {
                routeSizes[i] = this.booleMatrix[starterNode][i];
                this.algorithmOutput.push({
                    from: starterNode,
                    to: i,
                    log: VisualNode.getValueByNodeId(i)
                });
                routes[i] = [starterNode, i];
            } else routeSizes[i] = Infinity;
        }
        routeSizes[starterNode] = 0;
        visitedNodes[starterNode] = 1;
        ok = 1;
        while (ok) {
            minimum = Infinity;
            for (let i in this.booleMatrix) {
                if (routeSizes[i] < minimum && visitedNodes[i] === undefined) {
                    minimum = routeSizes[i];
                    k = i;
                }
            }
            if (minimum === Infinity)
                ok = 0;
            else {
                visitedNodes[k] = 1;
                for (let i in this.booleMatrix) {
                    if (this.booleMatrix[k][i] > 0)
                        if (minimum + this.booleMatrix[k][i] < routeSizes[i]) {
                            routeSizes[i] = minimum + this.booleMatrix[k][i];
                            oldRoute = Object.assign([], routes[i])
                            routes[i] = Object.assign([], routes[k]);
                            routes[i].push(i);
                            if (oldRoute.length > 2) {
                                oldRoute = this.findTheDifference(oldRoute, routes[i]);
                                this.algorithmOutput.push({
                                    unmark: oldRoute
                                });
                            } else if (oldRoute.length > 0) {
                                this.algorithmOutput.push({
                                    unmark: oldRoute
                                });
                            }
                            this.algorithmOutput.push({
                                from: k,
                                to: i,
                                log: VisualNode.getValueByNodeId(i)
                            });
                        }
                }
            }
        }
        for (let i in routeSizes) {
            this.algorithmOutput.log.push(VisualNode.getValueByNodeId(i) + ": " + routeSizes[i] + NEW_LINE);
        }
    }

    /**
     * Kruskal algorithm
     */
    kruskal() {
        let components = [];
        let source, target;
        let sum = 0;
        let minimum;
        let temp;
        //sort the edge list
        for (let i = 0; i < this.edgeList.length - 1; i++) {
            if (this.edgeList[i] !== undefined) {
                minimum = i;
                for (let j = i + 1; j < this.edgeList.length; j++) {
                    if (this.edgeList[j] !== undefined && this.edgeList[j].weight < this.edgeList[minimum].weight) minimum = j;
                }
                temp = this.edgeList[i];
                this.edgeList[i] = this.edgeList[minimum];
                this.edgeList[minimum] = temp;

                this.tblEdgeList.updateTable((i + 1).toString(), SOURCE, VisualNode.getValueByNodeId(this.edgeList[i].source));
                this.tblEdgeList.updateTable((i + 1).toString(), TARGET, VisualNode.getValueByNodeId(this.edgeList[i].target));
                this.tblEdgeList.updateTable((i + 1).toString(), WEIGHT, this.edgeList[i].weight.toString());

                this.tblEdgeList.updateTable((minimum + 1).toString(), SOURCE, VisualNode.getValueByNodeId(this.edgeList[minimum].source));
                this.tblEdgeList.updateTable((minimum + 1).toString(), TARGET, VisualNode.getValueByNodeId(this.edgeList[minimum].target));
                this.tblEdgeList.updateTable((minimum + 1).toString(), WEIGHT, this.edgeList[minimum].weight.toString());
            }

        }

        this.algorithmOutput.push({info: $.i18n(EDGE_LIST_SORT), markAll: true});

        for (let i in this.booleMatrix) {
            components[i] = i;
        }

        for (let i in this.edgeList) {
            source = this.edgeList[i].source;
            target = this.edgeList[i].target;
            if (components[source] !== components[target]) {
                let temp = components[target];
                for (let j in this.booleMatrix) {
                    if (components[j] === temp)
                        components[j] = components[source];

                }
                this.algorithmOutput.push({
                    from: source,
                    to: target,
                })
                this.algorithmOutput.log.push(VisualNode.getValueByNodeId(source) + EDGE_SEPARATOR + VisualNode.getValueByNodeId(target) + NEW_LINE);
                sum += this.edgeList[i].weight;
            }
        }


    }

    //3. Getters and Setters
    /**
     * Returns the graph as adjacency list representation
     * @returns {Object} The adjacency list
     */
    //Szomszédsági lista
    getAdjacencyList() {
        return this.adjacencyList;
    }

    /**
     * Returns the graph as boole matrix representation
     * @returns {Object} The boole matrix
     */
    //Pont pont mátrix
    getBooleMatrix() {
        return this.booleMatrix;
    }

    /**
     * Returns the graph as edge list representation
     * @returns {Object} The edge list
     */
    //Éllista
    getEdgeList() {
        return this.edgeList;
    }

    /**
     * Returns the graph as incidence matrix representation
     * @returns {Object} The incidence matrix
     */
    //Illeszkedési mátrix
    getIncidenceMatrix() {
        return this.incidenceMatrix;
    }

    /**
     * @returns {number} the number of nodes of the graph
     */
    get getNumberOfNodes() {
        return this.numberOfNodes;
    }

    /**
     * @returns {number} the number of edges of the graph
     */
    get getNumberOfEdges() {
        return this.numberOfEdges;
    }

    //3. Getters and Setters
    /**
     * Sets the visual representation for this graph
     * @param {VisualNode} visualNode A VisualNode class
     */
    setVisualNode(visualNode) {
        this.visualNode = visualNode;
    }

}

/**
 * This is the model of an undirected graph
 * @extends GenericGraph
 */
//Irányítatlan gráf
class UndirectedGraph extends GenericGraph {
    /**
     * Calls the constructor of its superclass
     * @param {number} [numberOfNodes] Number of nodes in the graph
     * @param {number} [numberOfEdges] Number of edges in the graph
     * @param {Object} [booleMatrix] Boole matrix representation
     * @param {Object} [incidenceMatrix] Incidence matrix representation
     * @param {Object} [adjacencyList] Adjacency list representation
     * @param {Object} [edgeList] Edge list representation
     */
    constructor(numberOfNodes = 0, numberOfEdges = 0, booleMatrix = [],
                incidenceMatrix = [], adjacencyList = [], edgeList = []) {
        super(numberOfNodes, numberOfEdges, booleMatrix,
            incidenceMatrix, adjacencyList, edgeList);
    }

    //1. Base operations
    /**
     * Adds a new edge to the graph
     * @param {Object} edge The actual edge we want to add
     */
    addNewEdge(edge) {
        super.addNewEdge(edge);
        //Adding reverse edges where is necessary
        //Boole matrix
        this.booleMatrix[edge.target][edge.source] = 1;

        //Adjacency list
        this.adjacencyList[edge.target].push(edge.source);

    }

    /**
     * Adds an edge to the representation tables in the DOM
     * @param {Object} edge The edge to add
     */
    addEdgeToTable(edge) {
        super.addEdgeToTable(edge);

        const source = edge.source;
        const target = edge.target;
        const sourceNode = $("div[id='" + source + "']");

        //Boole matrix
        this.tblBooleMatrix.updateTable(target, source, '1');

        //Adjacency list
        this.tblAdjacencyList.pushElementToRow(target, source, VisualNode.getValueFromNode(sourceNode));
    }

    /**
     * Removes a new edge to the graph
     * @param {Object} edge The actual edge we want to remove
     */
    removeEdge(edge) {
        super.removeEdge(edge);
        //Remove reverse edges where is necessary
        //Remove from the boole matrix
        delete this.booleMatrix[edge.target][edge.source];
        //Remove from the adjacency list
        for (let i in this.adjacencyList[edge.target])
            if (this.adjacencyList[edge.target][i] === edge.source)
                delete this.adjacencyList[edge.target][i];

    }

    /**
     * Removes an edge from the representation tables
     * @param {Object} edge Edge to remove from the representation table
     * @param {string} indexOfEdge Index of the edge in the edge list
     */
    removeEdgeFromTable(edge, indexOfEdge) {
        super.removeEdgeFromTable(edge, indexOfEdge);
        //Boole matrix
        this.tblBooleMatrix.updateTable(edge.target, edge.source, '0');

        //Adjacency list
        this.tblAdjacencyList.removeElement(edge.target, edge.source);

    }

    /**
     * Removes a node from the graph
     * @param {string} indexOfNode The index of the node we want to remove
     */
    removeNode(indexOfNode) {
        super.removeNode(indexOfNode);

    }

    /**
     * Update a weight in memory
     * @param {Object} edge The actual edge we want to update with included weight information
     * @param {number} indexOfEdge The index of the edge we want to edit
     */
    updateWeight(edge, indexOfEdge) {
        //Boole matrix
        this.booleMatrix[edge.source][edge.target] = edge.weight;
        this.booleMatrix[edge.target][edge.source] = edge.weight;

        //Edge list
        this.edgeList[indexOfEdge].weight = edge.weight;

    }

}

/**
 * This is the model of a directed graph
 * @extends GenericGraph
 */
//Irányított gráf
class DirectedGraph extends GenericGraph {

    /**
     * Calls the constructor of its superclass
     * @param {number} [numberOfNodes] Number of nodes in the graph
     * @param {number} [numberOfEdges] Number of edges in the graph
     * @param {Object} [booleMatrix] Boole matrix representation
     * @param {Object} [incidenceMatrix] Incidence matrix representation
     * @param {Object} [adjacencyList] Adjacency list representation
     * @param {Object} [edgeList] Edge list representation
     */
    constructor(numberOfNodes = 0, numberOfEdges = 0, booleMatrix = [],
                incidenceMatrix = [], adjacencyList = [], edgeList = []) {
        super(numberOfNodes, numberOfEdges, booleMatrix,
            incidenceMatrix, adjacencyList, edgeList);
    }

    /**
     * Adds a new edge to the graph
     * @param {Object} edge The actual edge we want to add
     */
    addNewEdge(edge) {
        super.addNewEdge(edge);
    }

    /**
     * Removes a new edge to the graph
     * @param {Object} edge The actual edge we want to remove
     * @param {string} [indexOfEdge] If the index of the edge is known, searching for it isn't necessary
     */
    removeEdge(edge) {
        super.removeEdge(edge);
    }

    /**
     * Removes a node from the graph
     * @param {string} indexOfNode The index of the node we want to remove
     */
    removeNode(indexOfNode) {
        super.removeNode(indexOfNode);
    }

    /**
     * Update a weight in memory
     * @param {Object} edge The actual edge we want to update with included weight information
     * @param {number} indexOfEdge The index of the edge we want to edit
     */
    updateWeight(edge, indexOfEdge) {
        //Boole matrix
        this.booleMatrix[edge.source][edge.target] = edge.weight;

        //Edge list
        this.edgeList[indexOfEdge].weight = edge.weight;

    }

}

/**
 * This is the model of a binary tree
 * Contains the specific algorithms for this type of graph
 * @extends GenericGraph
 */
//Bináris fa
class BinaryTree extends GenericGraph {
    root;
    //Graph representations
    parentArray = [];
    standardForm = [];
    binaryForm = [];

    /**
     * Calls the constructor of its superclass
     * @param {number} numberOfNodes The number of nodes in the graph
     * @param {number} numberOfEdges The number of edges in the graph
     */
    constructor(numberOfNodes = 0, numberOfEdges = []) {
        super(numberOfNodes, numberOfEdges);
    }

    //1. Base operations
    /**
     * Adds a new node to the binary tree
     * @param {string} indexOfNode Index of the node
     */
    addNewNode(indexOfNode) {

        //Adding the node to the parent array
        this.parentArray[indexOfNode] = 0;

        //Adding the node to the standard form
        this.standardForm[indexOfNode] = {
            left: 0,
            right: 0
        };

        //Adding the node to the binary form
        this.binaryForm[indexOfNode] = BINARY_ROOT;
    }

    /**
     * Adds the node to the representation tables in the DOM
     * @param {string} indexOfNode index of the node in table
     * @param {string} nodeValue value of the node
     */
    addNodeToTable(indexOfNode, nodeValue) {
        //Parent array
        this.tblParentArray.addColumn(indexOfNode, nodeValue);

        //Standard form
        this.tblStandardForm.addColumn(indexOfNode, nodeValue);

        //Binary Form
        this.tblBinaryForm.addRow(indexOfNode, nodeValue);
        this.tblBinaryForm.updateTable(indexOfNode, COLUMN_BINARY_FORM, BINARY_ROOT);

        //TODO Bracket Representation
        this.dtBracketForm.insert(indexOfNode, nodeValue);

    }

    /**
     * Adds a new edge to the binary tree
     * @param {Object} edge The new edge to add
     * @param {number} childType Type of the child node
     */
    addNewEdge(edge, childType) {

        //Adding the edge to the parent array
        this.parentArray[edge.target] = edge.source;

        //Adding the edge to the standard form
        if (childType === TYPE_LEFT)
            this.standardForm[edge.source].left = edge.target;
        else if (childType === TYPE_RIGHT)
            this.standardForm[edge.source].right = edge.target;

        //Adding the edge to the binary form
        if (childType === TYPE_LEFT) {
            this.binaryForm[edge.target] = this.binaryForm[edge.source] + BINARY_LEFT;
        }
        if (childType === TYPE_RIGHT) {
            this.binaryForm[edge.target] = this.binaryForm[edge.source] + BINARY_RIGHT;
        }
        this.setBinaryForm(edge.target);
    }

    /**
     * Adds an edge to the representation tables in the DOM
     * @param {Object} edge The new edge to add
     */
    addEdgeToTable(edge, childType) {
        const sourceNode = $("div[id='" + edge.source + "']");
        const targetNode = $("div[id='" + edge.target + "']");
        //Parent array
        this.tblParentArray.updateTable('1', edge.target, VisualNode.getValueFromNode(sourceNode));

        //Standard form
        if (childType === TYPE_LEFT)
            this.tblStandardForm.updateTable(ROW_LEFT, edge.source, VisualNode.getValueFromNode(targetNode));
        else if (childType === TYPE_RIGHT)
            this.tblStandardForm.updateTable(ROW_RIGHT, edge.source, VisualNode.getValueFromNode(targetNode));

        //Binary Form
        this.tblBinaryForm.updateTable(edge.target, COLUMN_BINARY_FORM, this.binaryForm[edge.target]);

        //TODO Bracket Representation
        this.dtBracketForm.moveElement(edge.target, edge.source, childType);
    }

    /**
     * Removes a node from the binary tree
     * @param {string} indexOfNode Index of the node to remove
     */
    removeNode(indexOfNode) {
        let childLeft;
        let childRight;
        if (this.standardForm[indexOfNode].left !== 0) {
            childLeft = this.standardForm[indexOfNode].left;
            if (this.standardForm[childLeft] !== undefined) {
                this.binaryForm[childLeft] = BINARY_ROOT;
                this.setBinaryForm(childLeft);
            }
        }
        if (this.standardForm[indexOfNode].right !== 0) {
            childRight = this.standardForm[indexOfNode].right;
            if (this.standardForm[childRight] !== undefined) {
                this.binaryForm[childRight] = BINARY_ROOT;
                this.setBinaryForm(childRight);
            }
        }
        delete this.binaryForm[indexOfNode];

        //Removing the node from the parent array
        delete this.parentArray[indexOfNode];

        //Removing the node from the standard form
        delete this.standardForm[indexOfNode];


        this.removeNodeFromTable(indexOfNode);
    }

    /**
     * Removes a given node from the representation tables
     * @param {string} indexOfNode Index of the node to remove
     */
    removeNodeFromTable(indexOfNode) {
        //Parent array
        this.tblParentArray.removeColumn(indexOfNode);

        //Standard form
        this.tblStandardForm.removeColumn(indexOfNode);

        //Binary form
        this.tblBinaryForm.removeRow(indexOfNode);

        //TODO Bracket Representation
        this.dtBracketForm.delete(indexOfNode);
    }

    /**
     * Removes an edge from the binary tree
     * @param {Object} edge The edge to remove
     */
    removeEdge(edge) {
        //Removing the edge from the parent array
        this.parentArray[edge.target] = 0;

        //Removing the edge from the standard form
        this.standardForm[edge.source].left = 0;
        this.standardForm[edge.source].right = 0;

        //Removing the edge from the binary Form
        this.binaryForm[edge.target] = BINARY_ROOT;
        this.setBinaryForm(edge.target);

    }

    /**
     * Removes an edge from the representation tables
     * @param {Object} edge The edge to remove
     * @param {number} childType The type of the child node
     */
    removeEdgeFromTable(edge, childType) {
        //Parent array
        this.tblParentArray.updateTable('1', edge.target, VALUE_NONE);

        //Standard form
        if (childType === TYPE_LEFT)
            this.tblStandardForm.updateTable(ROW_LEFT, edge.source, VALUE_NONE);
        else if (childType === TYPE_RIGHT)
            this.tblStandardForm.updateTable(ROW_RIGHT, edge.source, VALUE_NONE);

        //Binary Form
        this.tblBinaryForm.updateTable(edge.target, COLUMN_BINARY_FORM, BINARY_ROOT);

        //TODO Bracket Representation
        this.dtBracketForm.moveToRoot(edge.target);
        if ((this.standardForm[edge.source].right === 0 && childType === TYPE_LEFT) || (this.standardForm[edge.source].left === 0 && childType === TYPE_RIGHT))
            this.dtBracketForm.hideChildren(edge.source);
    }

    /**
     * Deletes the whole graph from the memory
     */
    deleteGraph() {
        for (let i in this.parentArray) {
            this.removeNode(i);
            this.visualNode.removeNode(i);
        }
    }

    /**
     * Initializes the tables in the representation section
     */
    initRepresentationTables() {
        this.tblParentArray = new TableHandler(ID_PARENT_ARRAY, $.i18n("parent-array"));
        this.tblStandardForm = new TableHandler(ID_STANDARD_FORM, $.i18n("standard-form"));
        this.tblBinaryForm = new TableHandler(ID_BINARY_FORM, $.i18n("binary-form"));
        this.dtBracketForm = new DynamicTextHandler(ID_BRACKET_REPRESENTATION, $.i18n("bracket-form"));
        //Init Parent array
        this.tblParentArray.addRow('1', null);
        //Init Standard form
        this.tblStandardForm.addRow(ROW_LEFT.toString(), $.i18n("left"));
        this.tblStandardForm.addRow(ROW_RIGHT.toString(), $.i18n("right"));
        //Init Binary Form
        this.tblBinaryForm.addColumn(COLUMN_BINARY_FORM, $.i18n("binary-form"));

    }

    /**
     * Removes all the representation tables from the DOM
     */
    dropRepresentationTables() {
        this.tblParentArray.drop();
        this.tblStandardForm.drop();
        this.tblBinaryForm.drop();
        this.dtBracketForm.drop();
    }

    /**
     * This function updates a value in the binary form table
     * It's the table updater of the setBinaryForm method
     * @param nodeId The node which needs to be updated
     * @param value The new value of the node
     */
    updateBinaryFormTable(nodeId, value) {
        this.tblBinaryForm.updateTable(nodeId, COLUMN_BINARY_FORM, value);
    }

    /**
     * Runs a preorder search to recalculate the binary representation for the graph considering the given node as the new root
     * It uses standard form to run the algorithm
     * @param indexOfNode
     */
    setBinaryForm(indexOfNode) {
        if (this.standardForm[indexOfNode].left != 0) {
            const childLeft = this.standardForm[indexOfNode].left;
            this.binaryForm[childLeft] = this.binaryForm[indexOfNode] + BINARY_LEFT;
            this.updateBinaryFormTable(childLeft, this.binaryForm[childLeft]);
            this.setBinaryForm(childLeft);
        }
        if (this.standardForm[indexOfNode].right != 0) {
            const childRight = this.standardForm[indexOfNode].right;
            this.binaryForm[childRight] = this.binaryForm[indexOfNode] + BINARY_RIGHT;
            this.updateBinaryFormTable(childRight, this.binaryForm[childRight]);
            this.setBinaryForm(childRight);
        }
    }

    /**
     * Finds and sets the root node of the binary tree
     */
    searchRootNode() {
        let multipleRoots = false;
        let firstRoot;
        for (let i in this.parentArray) {
            if (this.parentArray[i] === 0 && firstRoot === undefined)
                firstRoot = i;
            else if (this.parentArray[i] === 0)
                multipleRoots = true;
        }
        if (multipleRoots === false) {
            this.root = firstRoot;
            $(".node[id='" + firstRoot + "']").addClass("node-hover");
            this.runAlgorithm(menuItems.selectedAlgorithm);
            this.visualNode.loadSteps();
            this.visualNode.loadOutput();
            this.visualNode.selectedNode = firstRoot;
            this.visualNode.showMessage(GRAPH_ROOT_SELECTED_MSG);
            this.visualNode.removeMessage(1500);
            this.visualNode.animationTimer = setInterval(() => this.visualNode.goOneStepForward(), STEP_TIME);
            this.visualNode.switchToPauseButton();

        } else {
            this.visualNode.selectNode(ROOT_NODE_MSG);
        }
    }

    /**
     * Runs the selected algorithm and prepares the output for animation.
     * @param {string} algorithm Algorithm id
     */
    runAlgorithm(algorithm) {
        switch (algorithm) {
            case ID_PREORDER:
                this.preorderSearch(this.root);
                break;
            case ID_POSTORDER:
                this.postorderSearch(this.root);
                break;
            case ID_INORDER:
                this.inorderSearch(this.root);
                break;
            case ID_GET_HEIGHT:
                $("#output-body").text($("#output-body").text() + $.i18n("tree-height-output-text") + ": " + this.getHeight(this.root));
                break;
            case ID_GET_LEAVES:
                this.getLeaves();
                break;
            case ID_GET_DIRECT_CHILDS:
                this.getDirectChildNodes(this.root);
                break;
            case ID_GET_INDIRECT_CHILDS:
                this.getAllChildNodes(this.root);
                break;
        }
    }

    //2. Representation conversions
    /**
     * Returns the graph as parent array representation
     * @returns {Object} Returns the parent array of the binary tree
     */
    //Apa tömb
    getParentArray() {
        return this.parentArray;
    }

    /**
     * Returns the graph as bracket representation
     */
    //Teljes zárójeles alak
    getBracketRepresentation() {

    }

    /**
     * Returns the graph as Binary Tree Standard representation
     * @returns {Object} Returns the standard form of the binary tree
     */
    //Bináris fa standard alakja
    getStandardForm() {
        return this.standardForm;
    }

    /**
     * Returns the graph as Binary representation
     */
    //Bináris alak
    getBinaryRepresentation() {

    }

    //3. Specific algorithms
    /**
     * Preorder Search
     * @param {string} node The id of the node where we start the search
     */
    preorderSearch(node) {
        this.algorithmOutput.push({
            node: node
        });
        this.algorithmOutput.log.push(VisualNode.getValueByNodeId(node));
        if (this.standardForm[node].left !== 0) {
            this.preorderSearch(this.standardForm[node].left);
        }
        if (this.standardForm[node].right !== 0) {
            this.preorderSearch(this.standardForm[node].right);
        }
    }

    /**
     * Inorder Search
     * @param {string} node The id of the node where we start the search
     */
    inorderSearch(node) {
        if (this.standardForm[node].left !== 0) {
            this.inorderSearch(this.standardForm[node].left);
        }
        this.algorithmOutput.push({
            node: node
        });
        this.algorithmOutput.log.push(VisualNode.getValueByNodeId(node));
        if (this.standardForm[node].right !== 0) {
            this.inorderSearch(this.standardForm[node].right);
        }
    }

    /**
     * Postorder Search
     * @param {string} node The id of the node where we start the search
     */
    postorderSearch(node) {
        if (this.standardForm[node].left !== 0)
            this.postorderSearch(this.standardForm[node].left);
        if (this.standardForm[node].right !== 0)
            this.postorderSearch(this.standardForm[node].right);
        this.algorithmOutput.push({
            node: node
        });
        this.algorithmOutput.log.push(VisualNode.getValueByNodeId(node));
    }

    /**
     * Gets the height of the binary tree
     * @param {string} node The id of the root node of the binary tree
     */
    //Fa magassága
    getHeight(node) {
        let leftTmp = 0, rightTmp = 0;

        if (this.standardForm[node].left === 0 && this.standardForm[node].right === 0) return 0;
        if (this.standardForm[node].left !== 0) leftTmp = this.getHeight(this.standardForm[node].left);
        if (this.standardForm[node].right !== 0) rightTmp = this.getHeight(this.standardForm[node].right);

        //show message
        $("#steps-body").removeClass("display-none");
        $("#output-body").removeClass("display-none");
        $("#steps").addClass("steps-open");
        $("#steps > div .fa-chevron-left").addClass("fa-rotate-180");
        $("#right-splitter").removeClass("display-none");
        $("#steps-icon > span").removeClass("display-none");
        $("#resizable-right-body").addClass("steps-open");
        $("#middle-splitter").removeClass("display-none");


        return this.findMaxNumber(leftTmp, rightTmp);
    }

    /**
     * Finds a maximum between two numbers. This is a helper function for getHeight.
     * @param {number} leftTmp First number
     * @param {number} rightTmp Second number
     * @returns {number} The maximum between the two numbers
     */
    findMaxNumber(leftTmp, rightTmp) {
        if (leftTmp > rightTmp) return leftTmp + 1;
        else return rightTmp + 1;
    }

    /**
     * Gets the leaves of the binary tree
     */
    //Fa levelei
    getLeaves() {

        for (let i in this.standardForm) {
            if (this.standardForm[i].left === 0 && this.standardForm[i].right === 0)
                this.algorithmOutput.push({
                    node: i
                })
            this.algorithmOutput.log.push(VisualNode.getValueByNodeId(i));
        }
    }

    /**
     * Gets the direct child nodes of a given node
     * @param {string} indexOfParentNode The node we want the child nodes of
     */
    //Direkt leszármazottak
    getDirectChildNodes(indexOfParentNode) {
        let array = [];

        if (this.standardForm[indexOfParentNode].left != 0) array[1] = this.standardForm[indexOfParentNode].left;
        if (this.standardForm[indexOfParentNode].right != 0) array[2] = this.standardForm[indexOfParentNode].right;
        this.algorithmOutput.push({
            node: array[1]
        });
        this.algorithmOutput.log.push(VisualNode.getValueByNodeId(array[1]));
        this.algorithmOutput.push({
            node: array[2]
        });
        this.algorithmOutput.log.push(VisualNode.getValueByNodeId(array[2]));

    }

    /**
     * Gets all child nodes of a given node
     * @param {string} indexOfParentNode The node we want the child nodes of
     */
    //Összes leszármazott
    getAllChildNodes(indexOfParentNode) {
        if (this.standardForm[indexOfParentNode].left !== 0) {
            this.algorithmOutput.push({
                node: this.standardForm[indexOfParentNode].left
            });
            this.algorithmOutput.log.push(VisualNode.getValueByNodeId(this.standardForm[indexOfParentNode].left));
            this.getAllChildNodes(this.standardForm[indexOfParentNode].left);
        }

        if (this.standardForm[indexOfParentNode].right !== 0) {
            this.algorithmOutput.push({
                node: this.standardForm[indexOfParentNode].right,
            });
            this.algorithmOutput.log.push(VisualNode.getValueByNodeId(this.standardForm[indexOfParentNode].right));
            this.getAllChildNodes(this.standardForm[indexOfParentNode].right);
        }
    }

}
