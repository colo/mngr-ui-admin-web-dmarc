<!--
https://github.com/albertopereira/vuejs-treemap
Base on https://observablehq.com/@d3/zoomable-treemap
License: ISC
-->

<template>
  <div class="treemap">
    <!-- The SVG structure is explicitly defined in the template with attributes derived from component data -->
    <svg :height="height" style="margin-left: 0px;" :width="width">
      <g style="shape-rendering: crispEdges;" transform="translate(0,20)">
        <!-- We can use Vue transitions too! -->
        <transition-group name="list" tag="g" class="depth" v-if="selectedNode">
          <!-- Generate each of the visible squares at a given zoom level (the current selected node) -->
          <g
            class="children"
            v-for="(children, index) in selectedNode._children"
            :key="'c_' + children.id"
            >

            <!-- Generate the children squares (only visible on hover of a square) -->
            <rect
              v-for="child in children._children"
              class="child"
              :id="child.id"
              :key="child.id+'.child'"
              :height="y(child.y1) - y(child.y0)"
              :width="x(child.x1) - x(child.x0)"
              :x="x(child.x0)"
              :y="y(child.y0)"
              >
            </rect>

            <!--
              The visible square rect element.
              You can attribute directly an event, that fires a method that changes the current node,
              restructuring the data tree, that reactivly gets reflected in the template.
            -->
            <rect
              class="parent"
              v-on:click="selectNode"
              :id="children.id"
              :key="children.id"
              :x="x(children.x0)"
              :y="y(children.y0)"
              :width="x(children.x1 - children.x0 + children.parent.x0)"
              :height="y(children.y1 - children.y0 + children.parent.y0)"
              :style="{ fill: color(index) }"
              >

              <!-- The title attribute -->
              <title>{{ children.data.name }} | {{ __formatValue(children.value) }}</title>
            </rect>

            <!-- The visible square text element with the title and value of the child node -->
            <text
              dy="1em"
              :key="'t_' + children.id+'.1em'"
              :x="x(children.x0) + 6"
              :y="y(children.y0) + 6"
              style="fill-opacity: 1;"
              >
              {{ children.data.name }}
            </text>

            <text
              dy="2.25em"
              :key="'t_' + children.id"
              :x="x(children.x0) + 6"
              :y="y(children.y0) + 6"
              style="fill-opacity: 1;"
              >

              {{ __formatValue(children.value) }}
            </text>

          </g>
        </transition-group>

        <!-- The top most element, representing the previous node -->
        <g class="grandparent">

          <rect
            :height="margin.top"
            :width="width"
            :y="(margin.top * -1)"
            v-on:click="selectNode"
            :id="parentId">
          </rect>

          <!-- The visible square text element with the id (basically a breadcumb, if you will) -->
          <text
            dy=".65em"
            x="6"
            y="-14">

            {{ selectedNode.id }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('components:Treemap')
debug.log = console.log.bind(console) // don't forget to bind to console!

import {scaleLinear, scaleOrdinal} from 'd3-scale'
// import {json} from 'd3-request'
import {hierarchy, treemap} from 'd3-hierarchy'

// To be explicit about which methods are from D3 let's wrap them around an object
// Is there a better way to do this?
let d3 = {
  scaleLinear: scaleLinear,
  scaleOrdinal: scaleOrdinal,
  // json: json,
  hierarchy: hierarchy,
  treemap: treemap
}

export default {
  name: 'Treemap',
  // the component's data
  props: {
    formatValue: {
      type: Function,
      default: undefined
    },
    margin: {
      type: Object,
      default: function () {
        return {
          top: 20,
          right: 0,
          bottom: 0,
          left: 0
        }
      }
    },
    width: {
      type: Number,
      default: 960,
    },
    height: {
      type: Number,
      default: 530
    },
    tree: {
      type: Object,
      default: function () {
        return {
          'name': 'flare',
          'children': [
            {
              'name': 'analytics',
              'children': [
                {
                  'name': 'cluster',
                  'children': [
                    {'name': 'AgglomerativeCluster', 'value': 3938},
                    {'name': 'CommunityStructure', 'value': 3812},
                    {'name': 'HierarchicalCluster', 'value': 6714},
                    {'name': 'MergeEdge', 'value': 743}
                  ]
                },
                {
                  'name': 'graph',
                  'children': [
                    {'name': 'BetweennessCentrality', 'value': 3534},
                    {'name': 'LinkDistance', 'value': 5731},
                    {'name': 'MaxFlowMinCut', 'value': 7840},
                    {'name': 'ShortestPaths', 'value': 5914},
                    {'name': 'SpanningTree', 'value': 3416}
                  ]
                },
                {
                  'name': 'optimization',
                  'children': [
                    {'name': 'AspectRatioBanker', 'value': 7074}
                  ]
                }
              ]
            },
            {
              'name': 'animate',
              'children': [
                {'name': 'Easing', 'value': 17010},
                {'name': 'FunctionSequence', 'value': 5842},
                {
                  'name': 'interpolate',
                  'children': [
                    {'name': 'ArrayInterpolator', 'value': 1983},
                    {'name': 'ColorInterpolator', 'value': 2047},
                    {'name': 'DateInterpolator', 'value': 1375},
                    {'name': 'Interpolator', 'value': 8746},
                    {'name': 'MatrixInterpolator', 'value': 2202},
                    {'name': 'NumberInterpolator', 'value': 1382},
                    {'name': 'ObjectInterpolator', 'value': 1629},
                    {'name': 'PointInterpolator', 'value': 1675},
                    {'name': 'RectangleInterpolator', 'value': 2042}
                  ]
                },
                {'name': 'ISchedulable', 'value': 1041},
                {'name': 'Parallel', 'value': 5176},
                {'name': 'Pause', 'value': 449},
                {'name': 'Scheduler', 'value': 5593},
                {'name': 'Sequence', 'value': 5534},
                {'name': 'Transition', 'value': 9201},
                {'name': 'Transitioner', 'value': 19975},
                {'name': 'TransitionEvent', 'value': 1116},
                {'name': 'Tween', 'value': 6006}
              ]
            },
            {
              'name': 'data',
              'children': [
                {
                  'name': 'converters',
                  'children': [
                    {'name': 'Converters', 'value': 721},
                    {'name': 'DelimitedTextConverter', 'value': 4294},
                    {'name': 'GraphMLConverter', 'value': 9800},
                    {'name': 'IDataConverter', 'value': 1314},
                    {'name': 'JSONConverter', 'value': 2220}
                  ]
                },
                {'name': 'DataField', 'value': 1759},
                {'name': 'DataSchema', 'value': 2165},
                {'name': 'DataSet', 'value': 586},
                {'name': 'DataSource', 'value': 3331},
                {'name': 'DataTable', 'value': 772},
                {'name': 'DataUtil', 'value': 3322}
              ]
            },
            {
              'name': 'display',
              'children': [
                {'name': 'DirtySprite', 'value': 8833},
                {'name': 'LineSprite', 'value': 1732},
                {'name': 'RectSprite', 'value': 3623},
                {'name': 'TextSprite', 'value': 10066}
              ]
            },
            {
              'name': 'flex',
              'children': [
                {'name': 'FlareVis', 'value': 4116}
              ]
            },
            {
              'name': 'physics',
              'children': [
                {'name': 'DragForce', 'value': 1082},
                {'name': 'GravityForce', 'value': 1336},
                {'name': 'IForce', 'value': 319},
                {'name': 'NBodyForce', 'value': 10498},
                {'name': 'Particle', 'value': 2822},
                {'name': 'Simulation', 'value': 9983},
                {'name': 'Spring', 'value': 2213},
                {'name': 'SpringForce', 'value': 1681}
              ]
            },
            {
              'name': 'query',
              'children': [
                {'name': 'AggregateExpression', 'value': 1616},
                {'name': 'And', 'value': 1027},
                {'name': 'Arithmetic', 'value': 3891},
                {'name': 'Average', 'value': 891},
                {'name': 'BinaryExpression', 'value': 2893},
                {'name': 'Comparison', 'value': 5103},
                {'name': 'CompositeExpression', 'value': 3677},
                {'name': 'Count', 'value': 781},
                {'name': 'DateUtil', 'value': 4141},
                {'name': 'Distinct', 'value': 933},
                {'name': 'Expression', 'value': 5130},
                {'name': 'ExpressionIterator', 'value': 3617},
                {'name': 'Fn', 'value': 3240},
                {'name': 'If', 'value': 2732},
                {'name': 'IsA', 'value': 2039},
                {'name': 'Literal', 'value': 1214},
                {'name': 'Match', 'value': 3748},
                {'name': 'Maximum', 'value': 843},
                {
                  'name': 'methods',
                  'children': [
                    {'name': 'add', 'value': 593},
                    {'name': 'and', 'value': 330},
                    {'name': 'average', 'value': 287},
                    {'name': 'count', 'value': 277},
                    {'name': 'distinct', 'value': 292},
                    {'name': 'div', 'value': 595},
                    {'name': 'eq', 'value': 594},
                    {'name': 'fn', 'value': 460},
                    {'name': 'gt', 'value': 603},
                    {'name': 'gte', 'value': 625},
                    {'name': 'iff', 'value': 748},
                    {'name': 'isa', 'value': 461},
                    {'name': 'lt', 'value': 597},
                    {'name': 'lte', 'value': 619},
                    {'name': 'max', 'value': 283},
                    {'name': 'min', 'value': 283},
                    {'name': 'mod', 'value': 591},
                    {'name': 'mul', 'value': 603},
                    {'name': 'neq', 'value': 599},
                    {'name': 'not', 'value': 386},
                    {'name': 'or', 'value': 323},
                    {'name': 'orderby', 'value': 307},
                    {'name': 'range', 'value': 772},
                    {'name': 'select', 'value': 296},
                    {'name': 'stddev', 'value': 363},
                    {'name': 'sub', 'value': 600},
                    {'name': 'sum', 'value': 280},
                    {'name': 'update', 'value': 307},
                    {'name': 'variance', 'value': 335},
                    {'name': 'where', 'value': 299},
                    {'name': 'xor', 'value': 354},
                    {'name': '_', 'value': 264}
                  ]
                },
                {'name': 'Minimum', 'value': 843},
                {'name': 'Not', 'value': 1554},
                {'name': 'Or', 'value': 970},
                {'name': 'Query', 'value': 13896},
                {'name': 'Range', 'value': 1594},
                {'name': 'StringUtil', 'value': 4130},
                {'name': 'Sum', 'value': 791},
                {'name': 'Variable', 'value': 1124},
                {'name': 'Variance', 'value': 1876},
                {'name': 'Xor', 'value': 1101}
              ]
            },
            {
              'name': 'scale',
              'children': [
                {'name': 'IScaleMap', 'value': 2105},
                {'name': 'LinearScale', 'value': 1316},
                {'name': 'LogScale', 'value': 3151},
                {'name': 'OrdinalScale', 'value': 3770},
                {'name': 'QuantileScale', 'value': 2435},
                {'name': 'QuantitativeScale', 'value': 4839},
                {'name': 'RootScale', 'value': 1756},
                {'name': 'Scale', 'value': 4268},
                {'name': 'ScaleType', 'value': 1821},
                {'name': 'TimeScale', 'value': 5833}
              ]
            },
            {
              'name': 'util',
              'children': [
                {'name': 'Arrays', 'value': 8258},
                {'name': 'Colors', 'value': 10001},
                {'name': 'Dates', 'value': 8217},
                {'name': 'Displays', 'value': 12555},
                {'name': 'Filter', 'value': 2324},
                {'name': 'Geometry', 'value': 10993},
                {
                  'name': 'heap',
                  'children': [
                    {'name': 'FibonacciHeap', 'value': 9354},
                    {'name': 'HeapNode', 'value': 1233}
                  ]
                },
                {'name': 'IEvaluable', 'value': 335},
                {'name': 'IPredicate', 'value': 383},
                {'name': 'IValueProxy', 'value': 874},
                {
                  'name': 'math',
                  'children': [
                    {'name': 'DenseMatrix', 'value': 3165},
                    {'name': 'IMatrix', 'value': 2815},
                    {'name': 'SparseMatrix', 'value': 3366}
                  ]
                },
                {'name': 'Maths', 'value': 17705},
                {'name': 'Orientation', 'value': 1486},
                {
                  'name': 'palette',
                  'children': [
                    {'name': 'ColorPalette', 'value': 6367},
                    {'name': 'Palette', 'value': 1229},
                    {'name': 'ShapePalette', 'value': 2059},
                    {'name': 'SizePalette', 'value': 2291}
                  ]
                },
                {'name': 'Property', 'value': 5559},
                {'name': 'Shapes', 'value': 19118},
                {'name': 'Sort', 'value': 6887},
                {'name': 'Stats', 'value': 6557},
                {'name': 'Strings', 'value': 22026}
              ]
            },
            {
              'name': 'vis',
              'children': [
                {
                  'name': 'axis',
                  'children': [
                    {'name': 'Axes', 'value': 1302},
                    {'name': 'Axis', 'value': 24593},
                    {'name': 'AxisGridLine', 'value': 652},
                    {'name': 'AxisLabel', 'value': 636},
                    {'name': 'CartesianAxes', 'value': 6703}
                  ]
                },
                {
                  'name': 'controls',
                  'children': [
                    {'name': 'AnchorControl', 'value': 2138},
                    {'name': 'ClickControl', 'value': 3824},
                    {'name': 'Control', 'value': 1353},
                    {'name': 'ControlList', 'value': 4665},
                    {'name': 'DragControl', 'value': 2649},
                    {'name': 'ExpandControl', 'value': 2832},
                    {'name': 'HoverControl', 'value': 4896},
                    {'name': 'IControl', 'value': 763},
                    {'name': 'PanZoomControl', 'value': 5222},
                    {'name': 'SelectionControl', 'value': 7862},
                    {'name': 'TooltipControl', 'value': 8435}
                  ]
                },
                {
                  'name': 'data',
                  'children': [
                    {'name': 'Data', 'value': 20544},
                    {'name': 'DataList', 'value': 19788},
                    {'name': 'DataSprite', 'value': 10349},
                    {'name': 'EdgeSprite', 'value': 3301},
                    {'name': 'NodeSprite', 'value': 19382},
                    {
                      'name': 'render',
                      'children': [
                        {'name': 'ArrowType', 'value': 698},
                        {'name': 'EdgeRenderer', 'value': 5569},
                        {'name': 'IRenderer', 'value': 353},
                        {'name': 'ShapeRenderer', 'value': 2247}
                      ]
                    },
                    {'name': 'ScaleBinding', 'value': 11275},
                    {'name': 'Tree', 'value': 7147},
                    {'name': 'TreeBuilder', 'value': 9930}
                  ]
                },
                {
                  'name': 'events',
                  'children': [
                    {'name': 'DataEvent', 'value': 2313},
                    {'name': 'SelectionEvent', 'value': 1880},
                    {'name': 'TooltipEvent', 'value': 1701},
                    {'name': 'VisualizationEvent', 'value': 1117}
                  ]
                },
                {
                  'name': 'legend',
                  'children': [
                    {'name': 'Legend', 'value': 20859},
                    {'name': 'LegendItem', 'value': 4614},
                    {'name': 'LegendRange', 'value': 10530}
                  ]
                },
                {
                  'name': 'operator',
                  'children': [
                    {
                      'name': 'distortion',
                      'children': [
                        {'name': 'BifocalDistortion', 'value': 4461},
                        {'name': 'Distortion', 'value': 6314},
                        {'name': 'FisheyeDistortion', 'value': 3444}
                      ]
                    },
                    {
                      'name': 'encoder',
                      'children': [
                        {'name': 'ColorEncoder', 'value': 3179},
                        {'name': 'Encoder', 'value': 4060},
                        {'name': 'PropertyEncoder', 'value': 4138},
                        {'name': 'ShapeEncoder', 'value': 1690},
                        {'name': 'SizeEncoder', 'value': 1830}
                      ]
                    },
                    {
                      'name': 'filter',
                      'children': [
                        {'name': 'FisheyeTreeFilter', 'value': 5219},
                        {'name': 'GraphDistanceFilter', 'value': 3165},
                        {'name': 'VisibilityFilter', 'value': 3509}
                      ]
                    },
                    {'name': 'IOperator', 'value': 1286},
                    {
                      'name': 'label',
                      'children': [
                        {'name': 'Labeler', 'value': 9956},
                        {'name': 'RadialLabeler', 'value': 3899},
                        {'name': 'StackedAreaLabeler', 'value': 3202}
                      ]
                    },
                    {
                      'name': 'layout',
                      'children': [
                        {'name': 'AxisLayout', 'value': 6725},
                        {'name': 'BundledEdgeRouter', 'value': 3727},
                        {'name': 'CircleLayout', 'value': 9317},
                        {'name': 'CirclePackingLayout', 'value': 12003},
                        {'name': 'DendrogramLayout', 'value': 4853},
                        {'name': 'ForceDirectedLayout', 'value': 8411},
                        {'name': 'IcicleTreeLayout', 'value': 4864},
                        {'name': 'IndentedTreeLayout', 'value': 3174},
                        {'name': 'Layout', 'value': 7881},
                        {'name': 'NodeLinkTreeLayout', 'value': 12870},
                        {'name': 'PieLayout', 'value': 2728},
                        {'name': 'RadialTreeLayout', 'value': 12348},
                        {'name': 'RandomLayout', 'value': 870},
                        {'name': 'StackedAreaLayout', 'value': 9121},
                        {'name': 'TreeMapLayout', 'value': 9191}
                      ]
                    },
                    {'name': 'Operator', 'value': 2490},
                    {'name': 'OperatorList', 'value': 5248},
                    {'name': 'OperatorSequence', 'value': 4190},
                    {'name': 'OperatorSwitch', 'value': 2581},
                    {'name': 'SortOperator', 'value': 2023}
                  ]
                },
                {'name': 'Visualization', 'value': 16540}
              ]
            }
          ]
        }
      }
    }
  },
  data () {
    return {
      // jsonData: null,
      rootNode: {},
      selected: null,
      color: {}
    }
  },
  // You can do whatever when the selected node changes
  watch: {
    selectedNode (newData, oldData) {
      // console.log('The selected node changed...')
    },
    tree: function (val) {
      this.create_treemap()
    }
  },
  // In the beginning...
  mounted () {
    this.create_treemap()
  },
  destroyed: function () {
    debug('destroyed', this.rootNode)
  },
  // The reactive computed variables that fire rerenders
  computed: {
    // The grandparent id
    parentId () {
      if (this.selectedNode.parent === undefined || this.selectedNode.parent === null) {
        return this.selectedNode.id
      } else {
        return this.selectedNode.parent.id
      }
    },
    // Returns the x position within the current domain
    // Maybe it can be replaced by a vuejs method
    x () {
      return d3.scaleLinear()
        .domain([0, this.width])
        .range([0, this.width])
    },
    // Returns the y position within the current domain
    // Maybe it can be replaced by a vuejs method
    y () {
      return d3.scaleLinear()
        .domain([0, this.height - this.margin.top - this.margin.bottom])
        .range([0, this.height - this.margin.top - this.margin.bottom])
    },
    // The D3 function that recursively subdivides an area into rectangles
    treemap () {
      return d3.treemap()
        .size([this.width, this.height])
        .round(false)
        .paddingInner(0)
    },
    // The current selected node
    selectedNode () {
      let node = null

      if (this.selected) {
        let nd = this.getNodeById(this.rootNode, this.selected, this)

        if (nd._children) {
          node = nd
        } else {
          node = nd.parent
        }
      } else {
        node = this.rootNode
      }

      // Recalculates the y and x domains
      this.x.domain([node.x0, node.x0 + (node.x1 - node.x0)])
      this.y.domain([node.y0, node.y0 + (node.y1 - node.y0)])

      return node
    }
  },
  methods: {
    __formatValue: function (value) {
      debug('__formatValue', this.formatValue)
      if (typeof this.formatValue === 'function') {
        return this.formatValue(value)
      }
      return value
    },
    create_treemap: function () {
      debug('create_treemap', Object.clone(this.tree))
      // let that = this

      // An array with colors
      this.color = d3.scaleOrdinal([
        '#023fa5', '#7d87b9', '#bec1d4', '#d6bcc0', '#bb7784', '#8e063b', '#4a6fe3', '#8595e1',
        '#b5bbe3', '#e6afb9', '#e07b91', '#d33f6a', '#11c638', '#8dd593', '#c6dec7', '#ead3c6',
        '#f0b98d', '#ef9708', '#0fcfc0', '#9cded6', '#d5eae7', '#f3e1eb', '#f6c4e1', '#f79cd4'
      ])

      // loads the data and calls the initialization methods
      // d3.json('../static/flare.json',
      //   function (error, data) {
      // if (error) console.log(error)
      // this.jsonData = this.tree
      this.initialize()
      this.accumulate(this.rootNode, this)
      this.treemap(this.rootNode)
      //   }
      // )
    },
    // Called once, to create the hierarchical data representation
    initialize () {
      let that = this

      if (that.tree) {
        that.rootNode = d3.hierarchy(that.tree)
          .eachBefore(function (d) { d.id = (d.parent ? d.parent.id + '.' : '') + d.data.name })
          .sum((d) => d.value)
          .sort(function (a, b) {
            return b.height - a.height || b.value - a.value
          })
        that.rootNode.x = that.rootNode.y = 0
        that.rootNode.x1 = that.width
        that.rootNode.y1 = that.height
        that.rootNode.depth = 0
      }
    },
    // Calculates the accumulated value (sum of children values) of a node - its weight,
    // represented afterwards in the area of its square
    accumulate (d, context) {
      d._children = d.children

      if (d._children) {
        d.value = d._children.reduce(function (p, v) { return p + context.accumulate(v, context) }, 0)
        return d.value
      } else {
        return d.value
      }
    },
    // Helper method - gets a node by its id attribute
    getNodeById (node, id, context) {
      if (node.id === id) {
        return node
      } else if (node._children) {
        for (let i = 0; i < node._children.length; i++) {
          let nd = context.getNodeById(node._children[i], id, context)
          if (nd) {
            return nd
          }
        }
      }
    },
    // When a user clicks a square, changes the selected data attribute
    // which fires the computed selectedNode, which in turn finds the Node by the id of the square clicked
    // and the template reflects the changes
    selectNode (event) {
      this.selected = event.target.id
    }
  }
}
</script>

<style scoped>

text {
  pointer-events: none;
}

.grandparent text {
  font-weight: bold;
}

rect {
  fill: none;
  stroke: #fff;
}

rect.parent,
.grandparent rect {
  stroke-width: 2px;
}

.grandparent rect {
  fill: orange;
}

.grandparent:hover rect {
  fill: #ee9700;
}

.children rect.parent,
.grandparent rect {
  cursor: pointer;
}

.children rect.parent {
  fill: #bbb;
  fill-opacity: .5;
}

.children:hover rect.child {
  fill: #bbb;
}

.children text{
  font-size: 0.8em;
}

.grandparent text{
  font-size: 0.9em;
}

.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
}

</style>
