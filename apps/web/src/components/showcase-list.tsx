"use client";

import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import contractJson from "../abi/nicepfp.json";
import { ShowcaseItem } from "./showcase-item";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FixedSizeGrid } from "react-window";
import useResizeObserver from "use-resize-observer";

export const ShowcaseList = () => {
  const [supply, setSupply] = useState(0);
  const [columnCount, setColumnCount] = useState(4); // Default column count
  const [gridWidth, setGridWidth] = useState(0); // Width of the grid container

  const totalSupply = useContractRead({
    address: "0xf8C0f5B3e082343520bDe88d17Fa09E0aeAbEc34",
    abi: contractJson.abi,
    functionName: "totalSupply",
  });

  useEffect(() => {
    if (totalSupply.isSuccess) setSupply(Number(totalSupply.data));
  }, [totalSupply]);

  // Use ResizeObserver to dynamically adjust the grid width and column count
  const { ref: gridContainerRef, width: containerWidth = 0 } =
    useResizeObserver<HTMLDivElement>();

  useEffect(() => {
    if (containerWidth > 0) {
      setGridWidth(containerWidth);

      // Adjust column count based on container width
      let newColumnCount = 1;
      if (containerWidth < 480)
        newColumnCount = 1; // Extra small devices (phones)
      else if (containerWidth < 768)
        newColumnCount = 2; // Small devices (tablets)
      else if (containerWidth < 1024)
        newColumnCount = 3; // Medium devices (small laptops)
      else if (containerWidth < 1280)
        newColumnCount = 4; // Large devices (desktops)
      else newColumnCount = 8; // Extra large devices (large desktops)

      console.log("Container Width:", containerWidth);
      console.log("Column Count:", newColumnCount);

      setColumnCount(newColumnCount);
    }
  }, [containerWidth]);

  // Define the size of each grid cell with padding
  const cellPadding = 4;
  const cellWidth = (gridWidth - cellPadding * (columnCount - 1)) / columnCount;
  const cellHeight = cellWidth;

  // Calculate the number of rows
  const rowCount = Math.ceil(supply / columnCount);

  const Cell = ({
    columnIndex,
    rowIndex,
    style,
  }: {
    columnIndex: number;
    rowIndex: number;
    style: React.CSSProperties;
  }) => {
    const id = rowIndex * columnCount + columnIndex;
    if (id >= supply) return null; // Skip rendering if the ID exceeds the supply

    return (
      <div style={style} className="px-2">
        <ShowcaseItem key={id} id={id} />
      </div>
    );
  };

  return (
    <div className="w-full px-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-light">
            {supply} very nice pfps -{" "}
            <a
              className="underline"
              href="https://opensea.io/collection/nicepfp-art"
              target="_blank"
              rel="noopener noreferrer"
            >
              View OpenSea collection
            </a>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div ref={gridContainerRef} className="w-full">
            <FixedSizeGrid
              columnCount={columnCount}
              rowCount={rowCount}
              columnWidth={cellWidth}
              rowHeight={cellHeight}
              width={gridWidth}
              height={600}
            >
              {Cell}
            </FixedSizeGrid>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
