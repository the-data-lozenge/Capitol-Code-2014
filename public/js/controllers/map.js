/**
 CONTENTS PROPRIETARY AND CONFIDENTIAL

 Copyright © 2013 Knight Rider Consulting, Inc. All rights reserved.
 http://www.knightrider.com

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES INCLUDING,
 BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.
 */

/**
 *
 *    @author        Dale "Ducky" Lotts
 *    @since        7/1/13
 */
angular.module('abmitor.controllers').controller(
  "mapController",
  [
    '$scope',
    '$http',
    function ($scope, $http) {
      'use strict';

      console.log('Item controller');

      angular.extend($scope, {
        center: {
          lat: 48,
          lng: -91.2,
          zoom: 10
        },
        layers: {
          baselayers: {
            xyz: {
              name: 'OpenStreetMap (XYZ)',
              url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              type: 'xyz'
            }
          },
          overlays: {
            wms: {
              name: 'EEUU States (WMS)',
              type: 'wms',
              url: 'http://suite.opengeo.org/geoserver/usa/wms',
              layerParams: {
                layers: 'usa:states',
                format: 'image/png',
                transparent: true
              }
            }
          }
        }
      });


    // Get the countries geojson data from a JSON
      $http.get("resources/bounds.geojson").success(function(data, status) {
        angular.extend($scope, {
          geojson: {
            data: data,
            resetStyleOnMouseout: true
          }
        });
      });


    }
  ]);
