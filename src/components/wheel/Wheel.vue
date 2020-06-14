<template>
  <div id="wheel">
    <div class="wheel" v-show="wheelSpinning">
      <div class="pointer">
        <i class="el-icon-caret-bottom"></i>
      </div>

      <div class="wheel-canvas">
        <canvas id="canvas" width="500" height="500">
          <p style="color: white" align="center">
            Sorry, your browser doesn't support canvas. Please try another.
          </p>
        </canvas>
      </div>
    </div>

    <div class="results">
      <div class="subscriber" v-if="wheelSpinning">
        Roleta do {{ currentSubscriber.username }}
      </div>
      <div class="prize" v-if="prize">Prêmio: {{ prize.name }}</div>
    </div>

    <audio id="wheelAudio" preload="auto">
      <source src="@/assets/sounds/wheel.mp3" type="audio/mpeg" />
    </audio>

    <audio id="finishAudio" preload="auto">
      <source src="@/assets/sounds/finish.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script>
import axios from '@/repositories/clients/axios'
import * as Winwheel from "../../assets/scripts/Winwheel";

export default {
  name: "Wheel",

  data: () => ({
    subscribers: [],
    currentSubscriber: {},
    prize: null,
    theWheel: null,
    wheelSpinning: false,
    segments: [],
    prizes: [],
    host: process.env.VUE_APP_SERVER_HOST,
    port: process.env.VUE_APP_SERVER_PORT
  }),

  mounted() {
    this.checkCode();
    this.resetWheel();
  },

  methods: {
    checkCode () {
      // Todo: get valid code from server
      if (!this.$route.query.code) this.$router.push({ path: "/" });
    },

    async checkSubs() {
      if (this.subscribers.length === 0) return;
      this.currentSubscriber = this.subscribers[0];
      this.subscribers.shift();
      await this.getPrizes();
      if (this.prizes.length) this.startSpin();
    },

    async getPrizes() {
      const url = '/api/prizes';

      try {
        const response = await axios.get(url, { headers: {
          'x-code': this.$route.query.code
        } });

        this.prizes = response.data
        this.segments = this.formatSegments(response.data);
      } catch (e) {}
    },

    formatSegments(data) {
      const enabledItems = data.filter(item => item.enabled === true);

      return enabledItems.map(item => {
        return { fillStyle: item.color, text: item.name };
      });
    },

    startSpin() {
      if (this.wheelSpinning === false) {
        this.theWheel = new Winwheel.Winwheel({
          textFontSize: 19,
          numSegments: this.segments.length,
          segments: this.segments,
          animation: {
            type: "spinToStop",
            duration: 5,
            spins: 10,
            callbackFinished: this.onFinishSpin,
            callbackSound: this.playSound
          }
        });
        this.wheelSpinning = true;
        this.theWheel.startAnimation();
      }
    },

    playSound() {
      const audio = document.getElementById("wheelAudio");
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    },

    resetWheel() {
      this.currentSubscriber = null;
      this.prize = null;
      this.theWheel = new Winwheel.Winwheel({});
      if (this.wheelSpinning) {
        this.theWheel.stopAnimation(false);
      }
      this.theWheel.rotationAngle = 0;
      this.theWheel.draw(); 
      this.wheelSpinning = false;
    },

    onFinishSpin(indicatedSegment) {
      const finishAudio = document.getElementById("finishAudio");
      finishAudio.play();

      this.prize = this.prizes.find(item => item.name === indicatedSegment.text);

      if (!this.currentSubscriber.prizes) this.currentSubscriber.prizes = [];
      this.currentSubscriber.prizes.push(this.prize);

      if (this.prize.command === "@1") {
        this.subscribers.unshift(this.currentSubscriber);
      }

      if (this.prize.command === "@2") {
        this.subscribers.unshift(this.currentSubscriber);
        this.subscribers.unshift(this.currentSubscriber);
      }

      this.currentSubscriber.code = this.$route.query.code

      this.$socket.emit("sayPrize", this.currentSubscriber);

      setTimeout(() => {
        this.resetWheel();
      }, 3000);

      setTimeout(() => {
        this.checkSubs();
      }, 3100);
    }
  },
  sockets: {
    selectPrize(data) {
      if (data.code !== this.$route.query.code) return
      this.subscribers.push(data.subscriber);
      if (!this.wheelSpinning) this.checkSubs();
    }
  }
};
</script>

<style lang="scss">
html, body {
  background: transparent!important;
}
#wheel {
  .wheel {
    .pointer {
      margin-top: -10px;
      width: 100%;
      text-align: center;
      i {
        color: #0172ac;
        font-size: 48px;
      }
    }
    .wheel-canvas {
      text-align: center;
    }
    #canvas {
      margin-top: -12px;
    }
  }
  .results {
    font-size: 24px;
    margin-top: -2px;
    font-weight: 500;
    .subscriber {
      text-align: center;
      color: #f2d809;
      font-weight: 700;
      letter-spacing: 1px;
      text-shadow: 0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac,
        0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac,
        0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac,
        0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac,
        0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac,
        0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac,
        0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac,
        0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac,
        0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac, 0 0 3px #0172ac,
        0 0 3px #0172ac, 0 0 3px #0172ac;
      width: 100%;
      padding-bottom: 1px;
    }
    .prize {
      text-align: center;
      color: #f2d809;
      font-weight: 700;
      text-shadow: 0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e,
        0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e,
        0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e,
        0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e,
        0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e,
        0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e,
        0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e,
        0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e,
        0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e, 0 0 3px #fb426e,
        0 0 3px #fb426e, 0 0 3px #fb426e;
      width: 100%;
    }
  }
}
</style>
