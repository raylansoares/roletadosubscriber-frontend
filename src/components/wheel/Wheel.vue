<template>
  <div id="wheel">
    
    <div class="wheel" v-show="wheelSpinning">
        <div class="pointer">
            <md-icon class="md-size-5x">arrow_drop_down</md-icon>
        </div>
        <canvas id="canvas" width="434" height="434">
            <p style="color: white" align="center">Sorry, your browser doesn't support canvas. Please try another.</p>
        </canvas>
    </div>
    
    <div class="results">
        <div class="subscriber" v-show="currentSubscriber">Roleta para: {{ currentSubscriber }}</div>
        <div class="prize" v-show="prize">Prêmio: {{ prize }}</div>
    </div>

  </div>
</template>

<script>
import dayjs from 'dayjs'
import store from '@/store/index'
import * as Winwheel from '../../assets/scripts/Winwheel'

export default {
  name: 'Wheel',

  data: () => ({
        subscribers: [],
        currentSubscriber: null,
        prize: null,
        theWheel: null,
        wheelSpinning: false,
        WinWheelOptions: {
            textFontSize: 16,
            outterRadius: 212
        },
        segments: [
            {fillStyle : '#323eff', text : 'Piada do saci'},
            {fillStyle : '#ffffff', text : 'De timeout em alguém'},
            {fillStyle : '#ffed01', text : 'Jogo Gratuito'},
            {fillStyle : '#ffffff', text : 'Imagem para o cromakey'},
            {fillStyle : '#ff371f', text : 'Ganso'},
            {fillStyle : '#ffffff', text : 'Jogar água na cabeça'},
            {fillStyle : '#323eff', text : 'Adicionar emote da BTTV'},
            {fillStyle : '#ffffff', text : '500 rosecoins'},
            {fillStyle : '#ffed01', text : 'Frase de encerramento'},
            {fillStyle : '#ffffff', text : 'Pergunte ao Tesdey'},
            {fillStyle : '#ff371f', text : '10 minutos de timeout'},
            {fillStyle : '#ffffff', text : 'Desenho na cara'},
            {fillStyle : '#323eff', text : 'Anúncio de graça'},
            {fillStyle : '#ffffff', text : 'Roda 2x'},
            {fillStyle : '#ffed01', text : 'Lendária ou ban'},
            {fillStyle : '#ffffff', text : 'Duelo com Tesdey'},
            {fillStyle : '#ff371f', text : '500 rosecoins'},
            {fillStyle : '#ffffff', text : 'BG temático'},
            {fillStyle : '#323eff', text : 'Escolha 2 músicas'},
            {fillStyle : '#ffffff', text : 'De timeout em alguém'},
            {fillStyle : '#ffed01', text : '10 minutos de timeout'},
            {fillStyle : '#ffffff', text : 'Imagem para o cromakey'},
            {fillStyle : '#ff371f', text : 'Pergunte ao Tesdey'},
            {fillStyle : '#ffffff', text : 'Desenho na cara'},
            {fillStyle : '#323eff', text : 'Anúncio de graça'},
            {fillStyle : '#ffffff', text : 'Frase de encerramento'},
            {fillStyle : '#ff371f', text : 'Duelo com Tesdey'},
        ]
  }),

   mounted () {
    this.initSpin()
  },

  methods: {
    checkSubs () {
        if (this.subscribers.length === 0) return
        this.currentSubscriber = this.subscribers[0]
        this.subscribers.shift()
        this.startSpin()
    },

    startSpin () {
      if (this.wheelSpinning === false) {
        this.theWheel = new Winwheel.Winwheel({
          ...this.WinWheelOptions.Options,
          numSegments: this.segments.length,
          segments: this.segments,
          animation: {
            type: 'spinToStop',
            duration: 5,
            spins: 8,
            callbackFinished: this.onFinishSpin
          }
        })
        this.wheelSpinning = true
        this.theWheel.startAnimation()
      }
    },

    resetWheel () {
        this.currentSubscriber = null
        this.prize = null
        this.theWheel = new Winwheel.Winwheel({
            ...this.WinWheelOptions,
            numSegments: this.segments.length,
            segments: this.segments
        })
        if (this.wheelSpinning) {
            this.theWheel.stopAnimation(false) // Stop the animation, false as param so does not call callback function.
        }
        this.theWheel.rotationAngle = 0 // Re-set the wheel angle to 0 degrees.
        this.theWheel.draw() // Call draw to render changes to the wheel.
        this.wheelSpinning = false // Reset to false to power buttons and spin can be clicked again.
    },

    initSpin () {
        this.resetWheel()
    },

    onFinishSpin (indicatedSegment) {
        this.prize = indicatedSegment.text

        this.$socket.emit('sayPrize', { user: this.currentSubscriber, prize: this.prize })

        if (indicatedSegment.text === 'Roda 2x') {
            this.subscribers.unshift(this.currentSubscriber)
            this.subscribers.unshift(this.currentSubscriber)
        }

        setTimeout(() => {
            this.resetWheel()
        }, 5000)

        setTimeout(() => {
            this.checkSubs()
        }, 5100)
    }
  },
  sockets: {
    connect() {
      console.log('connect')
    },

    disconnect() {
      console.log('disconnect')
    },

    selectPrize(data) {
        // this.subscribers.push(data + parseInt(Math.random()*100))
        this.subscribers.push(data)
        if (!this.wheelSpinning) this.checkSubs();
    }
  },
}
</script>

<style lang="scss">
#wheel {
    .wheel {
        .pointer {
            width: 100%;
            text-align: center;
            .md-icon{
                color: #0172ac;
                height: 35px!important;
            }
        }
    }
    .results {
        font-size: 18px;
        margin-top: 20px;
        font-weight: 500;
        .subscriber {
            text-align: center;
            color: #0172ac;
            width: 100%;
            padding: 5px;
        }
        .prize {
            text-align: center;
            color: #fb426e;
            width: 100%;
            padding: 5px;
        }
    }
}
</style>