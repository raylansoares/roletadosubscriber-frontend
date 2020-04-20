<template>
  <div class="main-container">
    <div class="main">
      <p>
        Parece que não temos nada por aqui
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NotFoundView'
}
</script>

<style scoped lang="scss">
  .main-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-content: center;
    align-items: center;

    .main {
      width: 1280px;
      max-width: 1280px;
      padding: 0;
      text-align: center;
      color: #5f23a8;
      font-weight: 500;
      height: 100%;

        img {
            margin: 120px 0 40px 0;
            height: 170px;
            width: auto;
        }
    }
  }
</style>
