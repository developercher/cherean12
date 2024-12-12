'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface FlowNode {
  id: string;
  label: string;
  value: number;
}

interface FlowLink {
  source: string;
  target: string;
  value: number;
}

interface BehaviorFlowProps {
  data: {
    nodes: FlowNode[];
    links: FlowLink[];
  };
}

export default function BehaviorFlow({ data }: BehaviorFlowProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = 800;
    const height = 400;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const sankeyData = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 6]])
      (data);

    // Draw nodes
    svg.append('g')
      .selectAll('rect')
      .data(sankeyData.nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', '#3B82F6')
      .append('title')
      .text(d => `${d.label}\n${d.value} visitors`);

    // Draw links
    svg.append('g')
      .selectAll('path')
      .data(sankeyData.links)
      .join('path')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke', '#E5E7EB')
      .attr('stroke-width', d => Math.max(1, d.width))
      .attr('fill', 'none')
      .append('title')
      .text(d => `${d.source.label} → ${d.target.label}\n${d.value} visitors`);

  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">User Flow</h2>
      <div className="overflow-x-auto">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
} 