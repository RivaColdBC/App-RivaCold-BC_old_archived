<template>
  <title>RivaColdSelect - Ficha Tecnica</title>
  <div class="container text-center">
    <img
      src="../../assets/resources/A4-21 cm Logo nuevo+arbol.jpg"
      style="width: 100%; height: auto"
    />
    <hr class="hr4" />
    <div class="row">
      <div class="col-5">
        <table id="table_FT" class="table table-striped"></table>
      </div>
      <div class="col-7">
        <div class="row">
          <div class="col-6 none">
            <select class="form-select" id="list_type" @change="SeleccionarGama()">
              <option value="Eq">Equipo</option>
              <option value="Evap">Evaporador</option>
              <option value="Cond">Condensador</option>
              <option value="Central">Central</option>
            </select>
            <select class="form-select" id="list_marca" @change="SeleccionarMarca()"></select>
          </div>
          <div class="col-6 none">
            <select class="form-select" id="list_gama" @change="SeleccionarModelo()"></select>
            <select class="form-select" id="list_modelo" @change="FichaTecnica()"></select>
          </div>
        </div>
        <div class="row">
          <label>Tabla de potencia frigorífica</label>
          <table
            class="table table-striped"
            id="table_PC"
            style="text-align: center; vertical-align: middle"
          >
            <thead>
              <tr></tr>
            </thead>
            <tbody id="table_PC_body">
              <tr></tr>
            </tbody>
          </table>
        </div>
        <img src="" id="imagenmodelo" style="width: 75%; height: auto" />
        <img src="" id="imagenEsquema1" style="width: 75%; height: auto" />
        <img src="" id="imagenEsquema3" style="width: 75%; height: auto" />
        <img id="imagenEsquema2" src="" style="width: 75%; height: auto" />
      </div>
    </div>
  </div>
  <nav class="navbar sticky-bottom">
    <div class="position-absolute top-0 start-50 translate-middle">
      <button type="button" @click="PrintFichaTecnica()"><i class="bi bi-printer"> </i></button>
    </div>
  </nav>
<VueScriptComponent
  script='<script type="text/javascript" src="./controller.js"> </script>'
></VueScriptComponent>

</template>

<style lang="css">
@import './style.css';
</style>
