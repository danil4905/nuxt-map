<template>
  <section id="office">
    <app-container>
      <div class="wrapper">
        <div>
          <app-title title="Карта офиса"/>
        </div>
          <div :class="$style.tabcontroller">
          <div v-if="this.currentCity.value === 'Kirov'" :class="$style.floorBtn">
            <button @click="()=>changeTab(2)" class="tabControl tabLink"
                    :class="['additionalClass',{'tabActive':this.currentFloor === 2}]"
                    >2 этаж
            </button>
          </div>
          <div v-else-if="this.currentCity.value === 'Izhevsk'">
            <button @click="()=>changeTab(4)" class="tabControl tabLink"
                    :class="['additionalClass',{'tabActive':this.currentFloor === 4}]"
                    >4 этаж
            </button>
            <button @click="()=>changeTab(6)" class="tabControl tabLink"
                    :class="['additionalClass',{'tabActive':this.currentFloor === 6}]"
                    >6 этаж
            </button>
            <button @click="()=>changeTab(7)" class="tabControl tabLink"
                    :class="['additionalClass',{'tabActive':this.currentFloor === 7}]"
                    >7 этаж
            </button>
            <button @click="()=>changeTab(8)" class="tabControl tabLink"
                    :class="['additionalClass',{'tabActive':this.currentFloor === 8}]"
                    >8 этаж
            </button>
          </div>
          <div v-else-if="this.currentCity.value === 'Saint Petersburg'" :class="$style.floorBtn">
            <button @click="()=>changeTab(3)" class="tabControl tabLink"
                    :class="['additionalClass',{'tabActive':this.currentFloor === 3}]"
                    >3 этаж
            </button>
          </div>
          <div v-else-if="this.currentCity.value === 'Kazan'" :class="$style.floorBtn">
            <button @click="()=>changeTab(3)" class="tabControl tabLink"
                    :class="['additionalClass',{'tabActive':this.currentFloor === 3}]">3 этаж
            </button>
          </div>
            <v-app :class="$style.inputWrapper" class="search">
          <v-autocomplete
            class="search"
            clearable
            placeholder="Фамилия сотрудника"
            :items="this.users.map(el => el.lastName+ ' ' + el.firstName)"
            :search-input.sync="input"
            :loading="this.loading"
            hide-no-data
            solo
            prepend-icon="mdi-magnify"
          >
            <template v-slot:selection="data">
              {{data.item}}
            </template>
            <template v-slot:item="data">
              <template v-if="typeof data.item !== 'object'">
                <v-list-item-content v-text="data.item"  @click="() => {startSearch(data.item)}"></v-list-item-content>
              </template>
              <template v-else>
                <v-list-item-content>
                  <v-list-item-title v-html="data.item"></v-list-item-title>
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>
            </v-app>
<!--          <label :class="$style.searchGroup" v-if="!editMode">-->
<!--            <img src="~/assets/images/search.png" alt="" :class="$style.searchicon">-->
<!--          </label>-->
        </div>
          <div class="tabcontent">
            <div class="floors">
              <div class="floor active photo-wrapper floor-map" :class="$style.floorMap" ref="wrapper">
                <transition-group name="fade" mode="out-in" >
                  <IzhevskMap v-show="currentCity.value === 'Izhevsk'" key="1"/>
                  <KirovMap v-show="currentCity.value === 'Kirov'" key="2"/>
                  <KazanMap v-show="currentCity.value === 'Kazan'" key="3"/>
                  <PeterBurgMap v-show="currentCity.value === 'Saint Petersburg'" key="Saint4"/>
                </transition-group>
              </div>
            </div>
          </div>
      </div>
    </app-container>
  </section>
</template>

<script>
import AppContainer from "@/components/AppContainer";
import AppTitle from "@/components/AppTitle";
import KazanMap from "@/components/maps/KazanMap";
import PeterBurgMap from "@/components/maps/PiterMap";
import KirovMap from "@/components/maps/KirovMap";
import IzhevskMap from "@/components/maps/IzhevskMap";

export default {
  name: "OfficeMap",
  components: {IzhevskMap, KirovMap, PeterBurgMap, KazanMap, AppTitle, AppContainer},
  data() {
    return {
      input: '',
      debounce: null,
      search: '',
      foundUser: null
    }
  },
  watch: {
    input(val) {
      if (!val) {
        this.debounceSearch()
      }
      this.debounceSearch()
    }
  },
  computed: {
    currentCity() {
      return this.$store.state.currentCity;
    },
    currentFloor() {
      return this.$store.state.currentFloor;
    },
    places() {
      return this.$store.state.places.places;
    },
    loading() {
      return this.$store.state.places.loading;
    },
    userId() {
      return this.$store.state.users.userId;
    },
    users() {
      return this.$store.state.users.users;
    }
  },
  methods: {
    changeTab(index) {
      this.$store.commit('CHANGE_FLOOR', index);
    },
    debounceSearch() {
       clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        if(this.input) {
          this.input = this.input.trim()
          let currentInput = this.input.trim();
          let lastName = currentInput.split(' ')[0];
          let firstName = currentInput.split(' ')[1];
          this.$store.dispatch('users/getUsers', {lastName, firstName})
          this.foundUser = this.users[0];
        }
        else {
          this.foundUser = {}
        }
      }, 350)
    },
    getPlace() {
      this.$store.dispatch('places/getPlace');
    },
    //Search in map
    searchFunc() {
        let wrap = this.$refs.wrapper // get wrap element
        if (this.foundUser.Places) {
          let searchElements = wrap.querySelectorAll('text')
          searchElements.forEach((element) => {
            let searchId = this.foundUser.Places[0].id;
            let placeId = element.getAttribute('data').trim()
            if (placeId * 1 === searchId * 1) {
              element.classList.add('found')
              this.scrollToElement(element)
            } else {
              element.classList.remove('found')
            }
          })
        } else {
          let searchElements = wrap.querySelectorAll('text')
          searchElements.forEach((element) => {
            element.classList.remove('found')
          })
        }
    },
    startSearch (user) {
      console.log(user)
      user = user.trim();
      let lastName = user.split(' ')[0];
      let firstName = user.split(' ')[1];
      this.$store.dispatch('users/getUsers', {lastName, firstName}).then(() => {
        this.foundUser = this.users[0];
      if(this.foundUser.Places) {
        let place = this.foundUser.Places[0];
        if(place.cityId !== this.currentCity.id || place.floor !== this.currentFloor) {
          this.$store.commit('CHANGE_CITY', place.cityId)
          this.changeTab(place.floor)
        }
      }
      this.searchFunc()}
      )
    },
    scrollToElement(el) {
      setTimeout(() => {
        let rect = el.getBoundingClientRect()
        window.scrollTo(rect.left + window.pageXOffset, rect.top + window.pageYOffset - window.innerHeight / 2)
        },
        310
      )
    }

  },

}
</script>


<style lang="scss" module>
.tabcontroller {
  margin: 16px 0 60px;
  display: flex;
  align-items: center;
  @include xs-minus {
    flex-direction: column;
    margin: 0;
    button {
      font-size: 22px;
    }
  }
  @include sm-plus {
    justify-content: space-between;
  }
  @include md-plus {
    margin: 40px 0 25px;
  }
  @include xl-plus {
    margin: 55px 0 30px;
  }
}

.searchGroup {
  position: relative;
  @include xs-minus {
    margin: 16px 0;
    width: 100%;
  }
}


.searchicon {
  position: absolute;
  top: 12px;
  left: 12px;
  @include md-plus {
    top: 14px;
    left: 18px;
  }
  @include xl-plus {
    top: 20px;
    left: 24px;
  }
}

.placesWrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
}

.floorMap {
  position: relative;
  svg {
    overflow: visible;
  }
}

.coordinates {
  position: absolute;
  cursor: pointer;
  transition: 0.2s all ease;
  pointer-events: bounding-box;


  text {
    fill: black;
    transition: 0.2s all ease;

    &:hover {
      stroke: black;
      text-decoration: black;
      border-bottom: 1px solid black;

    }
  }

}

.floorBtn {
  @include xs-minus {
    align-self: baseline;
  }
}

#kirov {
  @include xs-minus {
    height: auto;
  }
}
.inputWrapper {
  flex: none;
  .v-application--wrap {
    display: block;
    min-height: 1px;
  }
  @include md-plus {
    width: 474px!important;
  }
  @include xl-plus {
    width: 604px!important;
  }
}
</style>
<style lang="scss">
.takenPlace {
  fill: #9C9EA7;
}
.found {
  fill: #5082E6;
}
.v-application--wrap {
  min-height: 1px!important;
}
.search {
  width: 400px;
  background: $lightGray;
  padding: 5px 5px 5px 21px;
  border-radius: 10px;
  align-items: stretch!important;
  height: 44px;
  margin: 10px 0 20px;
  @include xs-minus {
    width: 100%;
  }
  @include md-plus {
    width: 474px;
    height: 44px;
    //padding-left: 40px;
  }
  @include xl-plus {
    width: 604px;
    height: 56px;
    //padding-left: 50px;
  }
  .v-input__prepend-outer {
    margin:0;
    margin-top: 0!important;
    margin-left: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @include xl-minus {
      margin-left: 18px;
    }
  }
  .v-input__control {
    min-height: 100% !important;
  }
.v-input__slot {
  border-radius: 8px;
  background: $lightGray!important;
  border: none!important;
  box-shadow: none!important;
  min-height: 100%;
  height: 100%;
  margin: 0;
  }
}
</style>
