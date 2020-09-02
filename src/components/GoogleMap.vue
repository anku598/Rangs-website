<template>
  <div class="section-start custom-section-padding">
    <div class="row m-0">
      <div class="col-md-12 p-0">
        <div class="rg-map-area">
          <div
            class="map-overlay"
            ref="overlay"
          ></div>
          <div
            id="rg-map"
            ref="mapcont"
          ></div>
          <div
            class="map-address"
            ref="address"
          >
            <h4>{{compData.title}}</h4>
            <p>{{compData.address}}</p>
            <span v-if="compData.email.length">Email :
              <p>
                <span
                  v-for="(email, idx) in compData.email"
                  :key="email"
                >
                  <a :href="'mailto:' + email">email</a>
                  <span v-if="idx < compData.email.length">,</span>
                </span>
              </p>
            </span>
            <span v-if="compData.phone.length">Phone :
              <p>{{compData.phone.join(" ")}}</p>
            </span>
            <span v-if="compData.fax.length">Fax :
              <p>{{compData.fax.join(", ")}}</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { componentDataType } from "../types";
import { HOST } from "../global";
import GoogleMapsLoader from "google-maps";
import { GMAP_KEY } from "../global";
import { TimelineMax, Power4 } from "gsap";
import ScrollMagic from "scrollmagic";

@Component({
  name: "GoogleMap"
})
export default class GoogleMap extends Vue {
  @Prop() public compData!: { [key: string]: any } | null;
  @Prop() public smController!: any | null;
  public HOST: string = HOST;

  public addAnimation(): void {
    const { overlay, address } = this.$refs;
    const MapAreaTl = new TimelineMax({ paused: true });

    MapAreaTl.fromTo(
      overlay,
      2,
      {
        scaleY: 1
      },
      {
        scaleY: 0,
        ease: Power4.easeInOut,
        transformOrigin: "center bottom"
      }
    ).fromTo(
      address,
      1,
      {
        yPercent: 20,
        opacity: 0
      },
      {
        yPercent: 0,
        opacity: 1,
        ease: Power4.easeInOut,
        clearProps: "all"
      },
      "-=0.8" as any
    );

    new ScrollMagic.Scene({
      triggerElement: "#rg-map",
      reverse: false,
      offset: -40,
      triggerHook: "onEnter"
    })
      .setTween(MapAreaTl.progress(0).resume())
      .addTo(this.smController);
  }

  public mounted(): void {
    GoogleMapsLoader.KEY = GMAP_KEY;
    GoogleMapsLoader.VERSION = "3.35";
    GoogleMapsLoader.load(google => {
      const mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 18,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(
          this.compData!.latitude,
          this.compData!.longitude
        ), // Rangs Bhaban, Dhaka
        // 23.7645182,90.3899401 Rangs Bhaban

        // How you would like to style the map.
        // This is where you would paste any style found on Snazzy Maps.
        styles: [
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [
              {
                color: "#e9e9e9"
              },
              {
                lightness: 17
              }
            ]
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [
              {
                color: "#f5f5f5"
              },
              {
                lightness: 20
              }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#ffffff"
              },
              {
                lightness: 17
              }
            ]
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#ffffff"
              },
              {
                lightness: 29
              },
              {
                weight: 0.2
              }
            ]
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [
              {
                color: "#ffffff"
              },
              {
                lightness: 18
              }
            ]
          },
          {
            featureType: "road.local",
            elementType: "geometry",
            stylers: [
              {
                color: "#ffffff"
              },
              {
                lightness: 16
              }
            ]
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [
              {
                color: "#f5f5f5"
              },
              {
                lightness: 21
              }
            ]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [
              {
                color: "#dedede"
              },
              {
                lightness: 21
              }
            ]
          },
          {
            elementType: "labels.text.stroke",
            stylers: [
              {
                visibility: "on"
              },
              {
                color: "#ffffff"
              },
              {
                lightness: 16
              }
            ]
          },
          {
            elementType: "labels.text.fill",
            stylers: [
              {
                saturation: 36
              },
              {
                color: "#333333"
              },
              {
                lightness: 40
              }
            ]
          },
          {
            elementType: "labels.icon",
            stylers: [
              {
                visibility: "off"
              }
            ]
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [
              {
                color: "#f2f2f2"
              },
              {
                lightness: 19
              }
            ]
          },
          {
            featureType: "administrative",
            elementType: "geometry.fill",
            stylers: [
              {
                color: "#fefefe"
              },
              {
                lightness: 20
              }
            ]
          },
          {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [
              {
                color: "#fefefe"
              },
              {
                lightness: 17
              },
              {
                weight: 1.2
              }
            ]
          }
        ]
      };
      const map = new google.maps.Map(
        this.$refs.mapcont as HTMLElement,
        mapOptions as any
      );

      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          this.compData!.latitude,
          this.compData!.longitude
        ),
        map,
        title: this.compData!.title
      });
    });

    this.$nextTick(() => {
      this.addAnimation();
    });
  }
}
</script>
