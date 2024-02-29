import React from 'react';

class Logo extends React.PureComponent {
  render() {
    const { props } = this;
    return (
      <div
        className="picture-container"
        style={{
          outlineStyle: props.border ? 'solid' : 'none',
          outlineColor: props.color,
        }}
      >
        <div
          className="picture"
          style={{ transform: props.transform }}
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 370 260"
            style={{ width: `${props.width}px`, height: `${props.height}px` }}
          >
            <g>
              <path
                style={{ fill: props.color }}
                d={`M242.694,150.939c-0.861,0.656-1.819,0.915-2.875,0.78c-0.657-1.19-1.777-1.907-2.942-2.017
                                c-0.34-2.188-2.7-3.496-4.938-2.304c0.002-0.013,0.007-0.023,0.007-0.034c0.554-2.685-2.365-4.228-4.579-3.51
                                c-1.256,0.409-2.38,0.966-3.424,1.613c0.338-1.628,0.396-3.326-0.014-5.133c-0.588-2.578-3.092-3.572-5.315-2.18
                                c-1.551,0.969-2.982,2.08-4.35,3.271c2.348-3.47,4.315-7.176,5.359-11.471c0.576-2.372-2.284-4.158-4.3-3.296
                                c-1.739,0.746-3.359,1.621-4.891,2.597c1.028-1.794,1.977-3.639,2.795-5.568c1.188-2.8-2.344-5.685-4.762-3.649
                                c-5.884,4.955-11.146,10.422-16.21,16.137c2.368-3.929,4.446-8.02,5.88-12.475c0.971-3.012-2.062-5.27-4.7-3.602
                                c-6.807,4.302-12.4,9.738-17.547,15.614c2.373-5.129,4.011-10.486,4.105-16.298c0.046-2.834-3.08-4.374-5.081-2.121
                                c-7.114,8.019-13.298,16.692-19.181,25.583c2.527-7.618,4.654-15.322,4.816-23.453c0.055-2.729-3.565-5.099-5.44-2.271
                                c-5.529,8.344-9.471,17.476-13.1,26.774c-2.178,5.585-3.809,11.945-6.341,17.672c0.18-9.319,1.896-18.642,0.355-27.959
                                c-0.43-2.603-4.181-3.297-5.21-0.7c-3.76,9.482-6.355,18.964-7.485,28.68c-0.451-3.893-0.767-7.823-1.205-11.737
                                c-0.162-1.435-2.173-1.077-2.162,0.287c0.088,11.142-1.787,23.359,3.537,33.66c1.385,2.682,5.667,1.771,5.255-1.435
                                c-1.41-10.988-0.719-21.349,1.779-31.545c-0.664,7.17-1.582,14.345-0.574,21.564c0.403,2.896,3.888,3.549,5.686,1.521
                                c5.987-6.742,7.588-15.995,10.77-24.177c1.061-2.729,2.119-5.474,3.21-8.206c-2.613,7.698-5.672,15.305-7.578,23.144
                                c-0.778,3.196,4.105,5.121,5.866,2.45c8.168-12.371,15.066-25.549,23.975-37.351c-4.654,11.928-14.628,22.079-19.224,33.973
                                c-1.449,3.755,3.225,6.041,5.776,3.348c10.146-10.694,17.808-23.962,28.452-34.138c-5.993,9.9-13.957,18.709-18.645,29.41
                                c-1.259,2.878,1.718,5.146,4.34,4.329c2.544-0.796,4.758-2.239,6.751-4.025c-0.333,0.748-0.666,1.496-0.956,2.271
                                c-1.13,2.988,2.462,6.189,5.126,3.927c10.191-8.665,16.146-22.761,26.354-31.454c-4.896,7.848-12.828,14.274-16.389,22.904
                                c-1.055,2.563,1.687,5.768,4.396,4.379c7.171-3.68,11.873-10.008,17.425-15.428c-2.079,3.542-5.031,7.007-6.216,10.287
                                c-1.188,3.286,2.343,5.792,5.157,3.954c1.553-1.017,2.907-2.308,4.194-3.695c-0.136,0.43-0.261,0.864-0.353,1.314
                                c-0.654,3.188,3.162,4.612,5.445,3.144c1.591-1.023,2.925-2.304,4.188-3.661c0.873,1.101,2.326,1.692,3.786,0.936
                                c2.022-1.046,3.709-2.297,5.277-3.746c2.425,1.307,5.39,0.883,8.549-0.673C249.2,155.244,246.641,149.062,242.694,150.939z`}
              />
              <path
                style={{ fill: props.color }}
                d={`M322.669,187.137c-8.097,4.924-14.469,12.804-22.83,17.257c2.212-3.702,4.8-7.146,7.624-10.406
                                c3.058-2.843,5.857-6.029,8.677-9.132c1.706-1.879-1.172-4.347-2.932-2.579c-2.564,2.569-5.096,5.157-7.515,7.829
                                c-1.943,1.841-3.999,3.545-6.244,4.976c0.99-1.832,2.069-3.624,3.232-5.376c7.497-6.049,13.649-14.516,20.18-20.872
                                c1.733-1.686-0.745-3.983-2.549-2.598c-7.552,5.798-14.69,12.652-20.334,20.489c-2.288,1.747-4.707,3.252-7.296,4.372
                                c0.804-1.174,1.621-2.34,2.445-3.498c6.68-6.351,12.193-14.069,19.31-20.035c1.662-1.393-0.609-4.067-2.359-2.9
                                c-4.592,3.063-8.573,6.739-12.211,10.751c5.188-6.566,10.552-12.994,16.365-19.044c1.526-1.593-0.642-4.114-2.297-2.587
                                c-10.005,9.269-18.002,22.695-29.951,29.826c2.176-3.125,4.368-6.262,6.641-9.33c6.622-6.338,12.31-14.018,18.987-19.957
                                c1.402-1.244-0.109-3.657-1.695-2.469c-7.606,5.703-13.782,12.688-19.487,20.1c-2.918,2.728-6.021,5.179-9.463,7.115
                                c2.494-3.901,5.159-7.761,8.011-11.48c7.284-6.177,12.541-14.518,20.38-20.177c1.244-0.896-0.254-2.654-1.491-1.818
                                c-7.211,4.88-13.556,11.072-19.212,17.86c2.254-3.781,4.627-7.625,7.241-11.251c4.974-5.408,9.816-10.986,15.573-14.943
                                c0.659-0.45-0.07-1.347-0.729-0.966c-6.714,3.891-12.007,9.242-16.639,15.212c-1.523,1.593-3.051,3.179-4.618,4.714
                                c-3.862,3.784-8.07,7.241-12.936,9.632c-5.167,2.543-1.042-1.812,0.133-3.594c1.623-2.475,3.466-4.799,5.117-7.261
                                c0.447-0.671-0.545-1.428-1.012-0.755c-3.087,4.437-6.63,8.503-8.825,13.484c-0.227,0.528,0.359,1.113,0.878,0.983
                                c5.876-1.441,10.736-4.625,15.159-8.543c-2.029,3.102-3.979,6.257-5.94,9.37c-0.412,0.655-0.092,1.452,0.479,1.802
                                c-2.502,3.461-4.861,6.992-7.086,10.531c-0.866,1.377,0.357,3.013,1.931,2.449c2.151-0.76,4.156-1.756,6.067-2.889
                                c-1.341,1.865-2.668,3.732-4.011,5.595c-1.095,1.517,0.686,3.02,2.166,2.486c2.67-0.959,5.139-2.227,7.457-3.717
                                c-1.781,2.26-3.562,4.519-5.356,6.77c-1.131,1.417,0.267,4.067,2.161,3.141c0.567-0.278,1.113-0.578,1.662-0.885
                                c0.004,1.2,0.982,2.343,2.359,2.097c2.535-0.44,4.901-1.246,7.143-2.305c-0.772,1.439-1.495,2.895-2.153,4.383
                                c-0.804,1.818,1.226,3.325,2.854,2.697c0.464-0.174,0.906-0.365,1.355-0.558c-1.36,2.101-2.602,4.287-3.689,6.588
                                c-0.851,1.797,1.08,3.18,2.68,2.717c6.369-1.869,11.415-5.935,16.325-10.239c-2.256,2.719-4.413,5.508-6.153,8.615
                                c-1.165,2.087,0.938,4.284,3.019,2.902c5.273-3.529,10.2-7.469,14.918-11.707c1.796-1.617-0.838-4.086-2.64-2.596
                                c-1.699,1.409-3.454,2.753-5.223,4.072c3.086-3.878,6.344-7.644,8.978-11.85C326.322,188.001,324.217,186.192,322.669,187.137z`}
              />
            </g>
            <path
              className="base-color"
              d={`M317.701,212.845c4.012-1.212,7.902-2.737,11.738-4.424c1.991-0.87,12.222-3.949,8.456-7.836
                            c-0.187-0.196-0.381-0.396-0.571-0.592c-0.17-0.175-0.355-0.311-0.545-0.42c-0.413-8.474-4.351-17.478-7.564-24.812
                            c-5.031-11.492-11.536-22.25-17.854-33.058c-0.841-1.442-3.164-0.088-2.521,1.4c4.231,9.842,8.829,19.522,12.942,29.414
                            c2.032,4.886,3.711,9.903,5.401,14.915c1.589,4.686,2.145,9.611,3.451,14.327c-4.359,2.156-8.869,3.975-13.496,5.49
                            c-11.07,3.639-21.057,3.271-31.982,1.128c-3.475-11.145-7.065-22.163-9.174-33.704c-1.021-5.609-1.942-18.377-8.747-20.388
                            c-0.817-0.24-1.473,0.584-0.987,1.31c4.865,7.29,5.378,16.597,6.56,25.039c1.689,12.063,6.062,23.931,10.05,35.392
                            c0.841,2.414,4.835,1.094,4.237-1.359c-0.144-0.659-0.319-1.313-0.508-1.958c0.356,1.234,6.464,2.179,7.606,2.379
                            c2.694,0.479,5.056-0.237,7.74-0.214C307.563,214.931,312.235,214.5,317.701,212.845z`}
            />
            <path
              className="base-color"
              d={`M300.838,217.832c-2.585,2.274-5.951,4.116-8.358,5.857c-4.705,3.41-9.471,6.727-14.177,10.128
                            c-4.029,2.908-8.895,5.627-10.707,10.53c-1.896,5.128,2.568,10.222,5.738,13.62c2.439,2.613,6.802-0.9,4.33-3.52
                            c-2.146-2.271-5.874-5.509-4.603-9.014c0.81-2.222,3.969-3.988,5.781-5.322c4.099-3.018,8.044-6.236,12.115-9.29
                            c1.69-1.263,4.956-4.708,8.838-8.652C299.472,220.698,301.54,219.004,300.838,217.832z`}
            />
            <path
              className="base-color"
              d={`M342.682,227.619c-3.253-2.264-6.922-3.989-10.304-6.049c-2.18-1.319-8.151-4.349-8.622-7.236
                            c-0.069-0.429-0.712-0.568-0.809-0.077c-1.565,7.942,14.088,15.609,19.435,19.546c9.579,7.045,15.489,3.578,23.84-3.453
                            c2.815-2.37-0.749-6.932-3.526-4.504c-2.64,2.319-5.289,4.988-8.496,6.521C350.41,234.176,345.41,229.514,342.682,227.619z`}
            />
            <path
              className="base-color"
              d={`M214.979,166.093c4.312-2.351,8.693,0.412,12.641,2.078c11.557,4.872,22.296-5.731,32.651-10.131
                            c-4.168,8.78-13.598,13.942-18.092,22.682c-4.657,9.057-4.271,24.715-1.842,34.31c0.677,2.671,4.112,1.457,4.66-0.543
                            c3.313-12.039-3.04-24.435,4.719-35.8c5.013-7.337,12.154-11.86,14.251-20.997c0.088-0.389,0.017-0.742-0.142-1.038
                            c1.079-0.691,1.316-1.916,0.977-3.042c1.59,0.269,3.189,0.497,4.796,0.674c0.525,0.059,0.966-0.057,1.32-0.272
                            c10.754,2.613,23.923-4.089,32.13-9.7c13.709-9.356,25.461-25.249,24.938-42.493c-0.072-2.376-3.754-2.361-4.083-0.087
                            c-0.03,0.171-0.063,0.329-0.089,0.498c-0.132-0.001-0.264-0.002-0.407,0.018c-5.358,0.786-10.965-0.77-16.082-2.227
                            c-6.263-1.777-16.01-4.803-20.914-10.2c6.757-0.563,14.314-4.186,20.443-6.139c7.033-2.238,16.689-6.199,18.846-14.035
                            c0.087-0.306,0.059-0.586-0.013-0.854c0.554-0.112,1.025-0.655,0.718-1.325c-8.674-19.038-22.907-35.871-44.299-40.051
                            c-7.498-1.462-15.321-1.026-22.89,0.831c8.994-4.625,14.334-16.99,15.459-26.151c0.101-0.774-1.117-1.255-1.376-0.431
                            c-3.28,10.5-8.601,20.091-17.919,25.867c5.314-6.491,8.1-15.095,5.063-22.819c-0.322-0.815-1.681-0.534-1.52,0.365
                            c1.985,11.029-4.558,20.579-12.412,27.684c-8.391,4.007-15.936,9.705-21.643,16.432c-14.94,17.625-17.278,43.629-10.302,64.975
                            c0.455,1.39,0.965,2.741,1.516,4.061c-3.083-1.926-6.544-3.436-9.37-3.074c-8.88,1.138-15.539,8.628-24.948,5.51
                            c-8.411-2.789-18.34-13.081-27.478-9.112c-0.065-0.065-0.147-0.12-0.246-0.147c-0.925-1.195-2.797-1.665-4.34-0.109
                            c-11.941,12.04-27.155,20.108-34.271,36.237c-3.306,7.491-2.556,15.358-1.783,23.236c1.061,10.823-1.103,19.744-4.998,29.719
                            c-0.887,2.271,2.267,4.235,3.749,2.172c0.504-0.697,0.968-1.424,1.413-2.157c1.188,0.28,2.537-0.104,2.986-1.448
                            c1.675-5.017,6.751-8.493,10.772-11.579c5.395-4.146,10.948-7.852,17.077-10.832c8.009-3.896,16.557-4.885,25.118-2.325
                            c6.473,1.934,13.089,4.027,19.94,3.728c5.789-0.255,11.862-1.435,16.487-5.133C209.133,170.566,211.635,167.917,214.979,166.093z
                                M227.593,53.307c11.969-16.62,35.721-25.171,55.607-21.458c18.907,3.532,32.337,19.335,40.96,35.539
                            c-0.639-0.147-1.33-0.009-1.794,0.565c-5.699,7.057-12.789,10.055-21.176,12.926c-5.297,1.819-12.751,3.19-17.37,6.64
                            c-0.375,0.283-0.543,0.658-0.56,1.037c-0.373,0.36-0.57,0.896-0.328,1.499c2.829,7.135,11.316,10.685,17.984,13.196
                            c6.637,2.499,14.562,5.017,21.817,4.314c-3.052,12.091-9.787,21.721-19.726,29.922c-4.969,4.105-10.603,7.303-16.603,9.623
                            c-6.353,2.454-12.081,2.556-18.568,1.839c-9.433-3.021-18.879-4.926-27.713-9.897c-10.28-5.788-16.694-15.624-20.678-26.45
                            C212.249,93.038,215.46,70.149,227.593,53.307z M175.879,170.373c-7.56-1.841-13.882-3.9-21.783-2.874
                            c-7.591,0.985-14.645,4.913-21.072,8.818c-4.326,2.628-9.895,6.271-14.293,10.607c0.317-1.888,0.512-3.791,0.589-5.69
                            c0.346-8.505-2.253-16.858-1.821-25.298c0.946-18.421,24.512-29.528,36.115-40.752c0.219-0.213,0.383-0.434,0.528-0.657
                            c11.186-2.512,18.826,7.631,29.447,10.506c5.98,1.619,11.612-1.209,16.784-3.834c5.661-2.877,9.759-1.855,14.377,1.982
                            c2.036,1.691,3.1,2.411,5.215,2.553c8.45,13.568,22.534,22.408,38.233,26.468c-5.845,2.355-11.021,5.918-16.671,8.755
                            c-4.489,2.254-8.621,2.734-13.376,0.738c-2.844-1.197-5.762-2.781-8.947-2.698c-6.324,0.168-10.757,3.752-15.262,7.843
                            C196.13,173.934,185.343,172.68,175.879,170.373z`}
            />
            <path
              className="base-color"
              d={`M269.751,65.55c1.737,0.646,2.911,2.334,3.942,3.798c0.943,1.344,1.581,3.502,3.395,3.876
                            c0.457,0.093,1.009-0.025,1.238-0.482c1.069-2.113-0.876-4.421-2.086-6.046c-1.401-1.88-3.325-3.415-5.691-3.793
                            C269.02,62.659,268.238,64.991,269.751,65.55z`}
            />
            <path
              className="base-color"
              d={`M290.724,56.965c1.394,1.457,2.192,3.59,3.796,4.768c0.447,0.327,1.226,0.117,1.269-0.5
                            c0.152-2.119-1.575-3.82-2.916-5.296c-1.728-1.887-3.806-3.33-5.808-4.887c-0.77-0.59-1.552,0.453-0.934,1.124
                            C287.637,53.8,289.195,55.372,290.724,56.965z`}
            />
            <path
              className="base-color"
              d="M320.685,141.241c-0.073,0.022-0.04,0.131,0.033,0.108C320.789,141.327,320.753,141.221,320.685,141.241z"
            />
            <path
              className="base-color"
              d={`M316.826,139.985c5.269,2.261,13.137,1.209,18.645-0.172c6.092-1.522,10.875-6.212,14.12-11.379
                            c3.974-6.322,6.535-13.217,7.767-20.576c0.821-4.893,1.685-12.207-2.59-15.771c-1.544-1.288-3.654-0.581-3.896,1.486
                            c-0.451,3.946,0.588,7.867,0.285,11.872c-0.473,6.239-2.802,12.383-5.47,17.976c-2.854,5.979-6.823,10.299-13.314,12.346
                            c-5.033,1.585-11.236,0.154-15.66,3.212C316.344,139.23,316.425,139.815,316.826,139.985z`}
            />
            <path
              className="base-color"
              d={`M52.903,143.83c20.248-4.477,40.597-7.995,60.43-14.158c1.264-0.392,0.665-2.422-0.605-2.218
                            c-20.347,3.25-40.276,8.063-60.271,13.004C50.368,140.978,50.743,144.307,52.903,143.83z`}
            />
            <path
              className="base-color"
              d={`M6.124,192.832c16.139-5.448,32.71-9.904,48.688-15.765c1.176-0.432,0.649-2.318-0.575-2.113
                            c-16.805,2.781-33.665,8.429-49.186,15.342C3.417,191.024,4.458,193.393,6.124,192.832z`}
            />
            <path
              className="base-color"
              d={`M66.057,214.314c-12.354,4.633-24.47,9.855-36.52,15.23c-8.521,3.801-19.409,7.234-26.205,13.937
                            c-0.914,0.902-0.667,2.449,0.719,2.692c2.678,0.469,4.972-1.073,7.249-2.292c5.776-3.087,12.006-5.505,17.973-8.2
                            c12.837-5.798,25.609-11.896,37.814-18.934C68.531,215.918,67.695,213.699,66.057,214.314z`}
            />
          </svg>
        </div>
        <div
          className="text"
          style={{ color: props.color }}
        >
          {props.text}
        </div>
      </div>
    );
  }
}
export default Logo;
