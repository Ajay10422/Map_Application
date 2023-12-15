# MapMap Documentation

## Introduction

MapMap is a Progressive Web Application designed for pathfinding, a fundamental concept in computer applications, particularly useful for determining the shortest route between two points. Pathfinding is commonly applied in various scenarios, such as navigation systems and logistics planning. The application employs algorithms like A\* or Dijkstra's algorithm to calculate the shortest path in a weighted graph. This documentation provides an overview of the project, from data gathering to the user interface.

## Dijkstra's Algorithm Integration

MapMap incorporates Dijkstra's algorithm as a fundamental component of its pathfinding strategy. Dijkstra's algorithm is a graph search algorithm designed to determine the shortest path between a specified source vertex and all other vertices in a graph with non-negative edge weights. The primary objective is to provide users with optimal routes within the Oshawa Driveway Network.

The algorithm employs a greedy approach, iteratively selecting vertices with the smallest tentative distance from the source vertex. Utilizing a priority queue, Dijkstra's algorithm efficiently updates distances during its execution, ensuring an accurate representation of the shortest paths. It relies on the principles of relaxation, evaluating and updating distances based on the discovery of shorter paths through current vertices.

Initialization of the algorithm involves setting the distance to the source vertex as 0 and distances to all other vertices as infinity. As the algorithm progresses, a set of visited vertices prevents redundant calculations, ensuring each vertex is processed only once. The termination of Dijkstra's algorithm occurs when all vertices have been visited, and the shortest paths from the source to all other vertices have been determined.

In practical terms, Dijkstra's algorithm finds applications in diverse fields, including computer networking (routing protocols), transportation systems, and geographic information systems (GIS) for route planning. The time complexity of the algorithm is O((V + E) log V), where V is the number of vertices and E is the number of edges, with the use of a priority queue contributing to this complexity. The space complexity is O(V), where V represents the number of vertices, used primarily for storing distances and the priority queue.

The integration of Dijkstra's algorithm enhances MapMap's ability to provide users with accurate and efficient route planning within the Oshawa Driveway Network.

## Oshawa Driveway Network

![Oshawa Driveway Network](/Docs/Images/Oshawa_driveway_data.png "Oshawa Driveway Network")

- **Data Collection**: Utilizing data from Open Streets Maps, the Oshawa Driveway Network serves as the foundation for our pathfinding algorithms.

## Network Analysis

![Oshawa Driveway Plot](/Docs/Images/DriveWay_Plot.png "Oshawa Driveway Plot")

- **Data Analysis**: An in-depth examination of the Oshawa Driveway Network data, identifying key patterns and characteristics.

## Graph Database (GraphDB) Integration

![GraphDB visualization of the Network](/Docs/Images/neo4j_DB.png "GraphDB visualization")

- **Data Storage**: Conversion of gathered data into a graph format and storage in GraphDB, providing efficient data retrieval for pathfinding calculations.

### GraphDB Nodes

#### Address Node

![Address Node](/Docs/Images/address_node.png "Address Node")

- Representing individual addresses in the Oshawa Driveway Network.

#### Intersection Node

![Intersection Node](/Docs/Images/intersection_node.png "Intersection Node")

- Representing intersections, crucial points in the network for pathfinding calculations.

### Neo4j (GraphDB) Integration Details

- **Graph Database Choice**: Neo4j is chosen for its graph database capabilities, allowing efficient representation of complex relationships in the Oshawa Driveway Network.

- **Query Optimization**: Neo4j's powerful query language, Cypher, is utilized to optimize graph queries, ensuring quick and accurate retrieval of pathfinding data.

- **Real-time Updates**: The dynamic nature of the Oshawa Driveway Network is seamlessly managed through Neo4j, enabling real-time updates to the graph database as changes occur.

- **Scalability**: Neo4j's scalability ensures that the application can handle the growing dataset of the Oshawa Driveway Network, maintaining performance as the network evolves.

- **Graph Visualization Tools**: Utilization of Neo4j's visualization tools for developers to analyze and debug the graph structure, aiding in the improvement of pathfinding algorithms.

## Application Pages

### 1. Login Page

![LogIn Page](/Docs/Images/n_1.png "LogIn Page")

- **User Authentication**: Secure login functionality to ensure data privacy and user-specific settings.

### 2. Home Page

![Home Page](/Docs/Images/n_2.png "Home Page")

- **User Dashboard**: Central hub for navigation within the application, displaying relevant information and options.

### 3. Location Auto Fill Suggestion

![Auto Fill Page](/Docs/Images/n_3.png "Auto Fill Page")

- **Efficient Input**: Auto-fill suggestions to enhance user experience and streamline location input.

### 4. Pin the Search Location

![Pin Location](/Docs/Images/n_4.png "Pin Location")

- **Customization**: Ability to add marker to the Searched Location.

### 5. Search For Destination Location

![Destination Location](/Docs/Images/n_6.png "Destination Location")

- **Intuitive Search**: User-friendly interface for searching and selecting destination locations.

### 6. Plot Route Between Source and Destination Location

![Source and Destination Location](/Docs/Images/n_7.png "Source and Destination Location")

- **Pathfinding Visualization**: Dynamic representation of the shortest route between selected source and destination locations.

## Future Works

- **Real-time Traffic Updates**: Integration with live traffic data to optimize route recommendations.
- **User Profile Management**: Allow users to customize their profiles and save favorite locations.

- **Offline Mode**: Support for basic functionality even when the user is offline, ensuring accessibility in various scenarios.

- **Feedback and Reporting**: Users can provide feedback on routes, helping improve the accuracy of pathfinding algorithms.

## Conclusion

MapMap combines advanced pathfinding algorithms with a user-friendly interface, providing a comprehensive solution for efficient route planning in the Oshawa Driveway Network. The integration of Neo4j enhances the project's scalability, performance, and ability to adapt to real-time changes in the network structure.
