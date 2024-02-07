Layout algorithms determine the position and size of tiles and groups. In this demo, you can use the drop-down menu below the component to apply different algorithms.

The TreeMap component supports three layout algorithms out of the box:

- **Squarified** (default)    
This algorithm lays the items out so that the aspect ratio will be closer to 1. In other words, this algorithm tries to make items as square as possible. 

- **Strip**     
This algorithm is a modification of the *"Squarified"* algorithm. At the beginning, the algorithm has an available area divided into several strips and a set of items to distribute between the strips. Throughout the layout process, the current strip is maintained. For each item to be arranged, the algorithm checks whether or not adding the item to the current strip improves the average aspect ratios of the rectangles in the current strip. If so, the item is added to the current strip. Otherwise, it is added to the next strip.
    
- **Slice and Dice**        
This algorithm uses parallel lines to divide an available area into rectangles that visualize items. In a hierarchical structure, each rectangle that visualizes an item is further divided into smaller rectangles that visualize its children, and so on.

Use the [layoutAlgorithm](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/#layoutAlgorithm) property to specify the tile layout. You can also implement your own algorithm. For this purpose, assign a function to the [layoutAlgorithm](/Documentation/ApiReference/UI_Components/dxTreeMap/Configuration/#layoutAlgorithm) property. This function calculates the coordinates of two diagonally-opposing points that define a rectangle and assigns them to the required item.