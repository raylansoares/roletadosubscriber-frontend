<template>
  <div id="faq-container" :class="theme">
    <div id="faq-container-inner">
      <h2 class="title" :class="theme">Dúvidas Frequentes</h2>

      <ul class="questions" :class="theme">
        <li class="question">
          <span class="question-content" :class="theme">
            Por que alguns comandos configurados nos prêmios não funcionam?
          </span>
          <p class="question-answer">
            O Bot necessita de algumas permissões especiais para determinados
            comandos, para o <strong>/timeout</strong> por exemplo, é preciso
            dar status de moderador para o bot. Para o comando
            <strong>/commercial</strong> o bot precisa ter permissão de editor.
          </p>
        </li>

        <li class="question">
          <span class="question-content" :class="theme">
            Por que os prêmios estão aparecendo 2x no chat?
          </span>
          <p class="question-answer">
            O link da roleta só pode estar ativo em um lugar, no OBS. Se os
            prêmios estão sendo anuncioados 2x no chat verifique se não deixou a
            roleta aberta em alguma aba do navegador. Lembrando que para utilizar
            a roleta em várias cenas diferentes no OBS é necessário copiar a
            primeira fonte cadastrada com o link da roleta e colar na nova cena a
            <strong>referência</strong> da fonte.
          </p>
        </li>

        <li class="question">
          <span class="question-content" :class="theme">
            Por que a roleta não aparece depois que eu coloco no OBS?
          </span>
          <p class="question-answer">
            Quando colocar a URL da roleta no OBS ela não vai aparecer mesmo,
            está certo. Isso acontece porque a roleta fica "invisível" enquanto
            não está girando. Assim que seu canal receber um subscriber ela vai
            aparecer automaticamente. Você também pode testar roletando
            manualmente aqui pelo nosso painel.
          </p>
        </li>

        <li class="question">
          <span class="question-content" :class="theme">
            Por que os testes de subscriber que faço pelo OBS não ativam a roleta?
          </span>
          <p class="question-answer">
            A roleta não aparece em testes de sub do OBS, nem do Streamelements
            nem do Streamlabs, isso acontece porque a roleta pega os eventos de
            subscriber direto da Twitch, e não desses serviços externos. Você
            pode testar roletando manualmente aqui pelo nosso painel.
          </p>
        </li>

        <li class="question">
          <span class="question-content" :class="theme">
            Pra que serve a opção Ativo/Inativo dos prêmios cadastrados?
          </span>
          <p class="question-answer">
            Apenas os prêmios ativos vão aparecer na roleta quando seu
            canal receber um subscriber, então você pode usar esse recurso caso
            queira desativar temporariamente um prêmio sem precisar excluir ele.
          </p>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "FaqContainer",

  computed: {
    ...mapState(['theme'])
  }
};
</script>

<style lang="scss" scoped>
#faq-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
  &.light {
    background: var(--color-background-light);
  }
  &.dark {
    background: var(--color-background-dark);
  }
  #faq-container-inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    max-width: 1150px;
    padding: 40px 0 60px 0;
    .title {
      font-size: 3em;
      padding: 10px 20px;
      color: var(--color-primary);
      &.light {
        color: var(--color-primary);
      }
      &.dark {
        color: var(--color-title-in-dark);
      }
    }
    .questions {
      font-size: 1.1em;
      padding: 0 20px;
      &.light {
        color: var(--color-text-base);
      }
      &.dark {
        color: var(--color-text-complement);
      }
      .question {
        list-style-type: none;
        padding: 10px 0;
        .question-content {
          display: block;
          font-size: 1.2em;
          &.light {
            color: var(--color-primary-darker);
          }
          &.dark {
            color: var(--color-primary-lighter);
          }
        }
        .question-answer {
          padding: 0 20px;
        }
      }
    }
  }
}
</style>
