In our next update, fixed column support will undergo a complete redesign. Designed before advanced CSS positioning tools were available, our current solution relies on two independent tables: one for fixed columns and another for the primary table. Synchronization between these tables is managed through code, which can fail in rare instances.

<!--split-->

In addition to the basic redesign, v24.2 will include a new sticky columns option. Sticky columns remain static initially but start scrolling when they reach their position. Once scrolling moves past this point, they reattach to a different side of the table. This feature improves usability by displaying important columns in a specific view (ensuring continuous access to critical information).