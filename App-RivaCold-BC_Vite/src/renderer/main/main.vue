<script setup>
import { newWindow } from './newWindow'
import { SQL } from './SQL'
</script>

<template>
  <br />
  <div class="row justify-content-center" style="text-align: center; vertical-align: text-bottom">
    <div class="col-3 align-self-center">
      <label style="color: rgba(21, 98, 116, 255)">CARGAR BASE DE DATOS: </label><br />
      <button @click="SQL('AzureSQL')">
        <i
          class="fa-solid fa-database fa-shake"
          style="font-size: 50px; color: rgba(21, 98, 116, 255)"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          data-bs-title="Base de datos Azure Microsoft."
        >
        </i>
      </button>
    </div>
    <div class="col-6 align-self-center">
      <img
        src="../assets/resources/0-logo.jpg"
        class="img-fluid"
        style="height: 80px; width: auto"
      />
    </div>
    <div class="col-3"></div>
    <div id="divprogressbar" class="progress" style="height: 30px; display: none; width: 80%">
      <div
        id="progressbar"
        class="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        style="width: 0%"
        aria-valuenow="0"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        0%
      </div>
    </div>
  </div>
  <br />
  <div class="row justify-content-center">
    <div class="card col-3">
      <img src="../assets/resources/1-fichatecnica.jpg" class="card-img-top" />
      <label class="buttonfunction" role="button" @click="newWindow('fichaTecnica')">
        <img src="../assets/resources/simbolo.jpg" height="25" /> Acceder
      </label>
    </div>
    <div class="card col-3">
      <img src="../assets/resources/2-equivalencias.jpg" class="card-img-top" />
      <div class="row">
        <div class="col-6">
          <label
            class="buttonfunction"
            role="button"
            @click="newWindow('./app/functEquivalencia/main.html')"
          >
            <img src="../assets/resources/simbolo.jpg" height="25" /> Por Equipo
          </label>
        </div>
        <div class="col-6">
          <label
            class="buttonfunction"
            role="button"
            @click="newWindow('./app/functEquivalenciaGama/main.html')"
          >
            <img src="../assets/resources/simbolo.jpg" height="25" /> Por Gama
          </label>
        </div>
      </div>
    </div>
    <div class="card col-3">
      <img src="../assets/resources/3-ofertas.jpg" class="card-img-top" />
      <label class="buttonfunction" role="button" @click="newWindow('./app/functOferta/main.html')">
        <img src="../assets/resources/simbolo.jpg" height="25" /> Acceder
      </label>
    </div>
  </div>
  <br />
  <div class="row justify-content-center">
    <div class="card col-3">
      <img src="../assets/resources/4-stock.jpg" class="card-img-top" />
      <label class="buttonfunction" role="button" @click="newWindow('./app/functStock/main.html')">
        <img src="../assets/resources/simbolo.jpg" height="25" /> Acceder
      </label>
    </div>
    <div class="card col-3">
      <img src="../assets/resources/5-calculadora.jpg" class="card-img-top" />
      <div class="row">
        <div class="col-6">
          <label
            class="buttonfunction"
            role="button"
            @click="newWindow('./app/functCalcCamara/main.html')"
          >
            <img src="../assets/resources/simbolo.jpg" height="25" /> Càmara
          </label>
        </div>
        <div class="col-6">
          <label
            class="buttonfunction"
            role="button"
            @click="newWindow('./app/functCalcConsumo/main.html')"
          >
            <img src="../assets/resources/simbolo.jpg" height="25" /> Consumo
          </label>
        </div>
      </div>
    </div>
    <div class="card col-3">
      <img src="../assets/resources/6-selequipo.jpg" class="card-img-top" />
      <label
        class="buttonfunction"
        role="button"
        @click="newWindow('./app/functSelectorEquipo/main.html')"
      >
        <img src="../assets/resources/simbolo.jpg" height="25" /> Acceder
      </label>
    </div>
  </div>
  <br />
  <div class="row justify-content-center">
    <div class="card col-3">
      <img src="../assets/resources/7-proyecto.jpg" class="card-img-top" />
      <div class="row">
        <div class="col-6">
          <label
            class="buttonfunction"
            role="button"
            @click="newWindow('./app/functCentralChiller/main.html')"
          >
            <img src="../assets/resources/simbolo.jpg" height="25" /> Chiller
          </label>
        </div>
        <div class="col-6">
          <label
            class="buttonfunction"
            role="button"
            @click="newWindow('./app/functMailing/main.html')"
          >
            <img src="../assets/resources/simbolo.jpg" height="25" /> Mailing
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <label
            class="buttonfunction"
            role="button"
            @click="newWindow('./app/functProyecto/main.html')"
          >
            <img src="../assets/resources/simbolo.jpg" height="25" /> Proyecto
          </label>
        </div>
      </div>
    </div>
    <div class="card col-3">
      <img src="../assets/resources/8-web.jpg" class="card-img-top" />
      <label class="buttonfunction" role="button" @click="newWindow('./app/functWeb/main.html')">
        <img src="../assets/resources/simbolo.jpg" height="25" /> Acceder
      </label>
    </div>
    <div class="card col-3">
      <img src="../assets/resources/9-KPIcomercial.jpg" class="card-img-top" />
      <div class="row">
        <div class="col-6">
          <label
            class="buttonfunction"
            role="button"
            @click="newWindow('./app/KPI/KPICliente/main.html')"
          >
            <img src="../assets/resources/simbolo.jpg" height="25" /> Cliente
          </label>
          <label
            class="buttonfunction"
            role="button"
            @click="newWindow('./app/KPI/KPIEquipo/main.html')"
          >
            <img src="../assets/resources/simbolo.jpg" height="25" /> Equipo
          </label>
        </div>
        <div class="col-6">
          <label
            class="buttonfunction"
            role="button"
            style="display: none"
            @click="newWindow('./app/KPI/KPIAdminCompra/main.html')"
          >
            <img src="../assets/resources/simbolo.jpg" height="25" /> Compra
          </label>
          <label
            class="buttonfunction"
            role="button"
            @click="newWindow('./app/KPI/KPIAdminVenta/main.html')"
          >
            <img src="../assets/resources/simbolo.jpg" height="25" /> Venta
          </label>
          <label
            class="buttonfunction"
            role="button"
            style="display: none"
            @click="newWindow('./app/KPI/KPIFactura/main.html')"
          >
            <img src="../assets/resources/simbolo.jpg" height="25" /> Factura
          </label>
        </div>
      </div>
    </div>
    <div class="card col-3">
      <img src="../assets/resources/11-mantenimiento.jpg" class="card-img-top" />
      <div class="row">
        <div class="col-6">
          <label
            class="buttonfunction"
            role="button"
            @click="newWindow('./app/Maintenance/Logging/main.html')"
          >
            <img src="../assets/resources/simbolo.jpg" height="25" /> Log
          </label>
        </div>
        <div class="col-6">
          <label
            class="buttonfunction"
            role="button"
            @click="newWindow('./app/Maintenance/Request/main.html')"
          >
            <img src="../assets/resources/simbolo.jpg" height="25" /> Request
          </label>
        </div>
      </div>
    </div>
  </div>
  <br />
  <div class="row text-center">
    <img src="../assets/resources/linealogos.jpg" class="img-fluid" />
  </div>
  <br />
  <div class="row justify-content-center" style="margin: 0">
    <div class="col-8" style="font: normal 6pt Arial; color: dimgray">
      <br /><b>Licencia de uso: </b>El contenido de este software es así como toda documentación
      incluida, constituye una obra protegida por derechos de autor cuyo titular es Basic Conection
      Systems S.L. y su proveedores RIVACOLD S.R.L. <br />
      El software y su documentación están disponibles solamente para su uso por los usuarios.
      <br />SE PROHIBE EXPRESAMENTE LA COPIA O LA REPRODUCCIÓN DEL SOFTWARE EN CUALQUIER OTRO
      SERVIDOR O UBICACIÓN PARA SU POSTERIOR REPRODUCCIÓN O REDISTRIBUCIÓN. <br />
      El presente software hace uso de las siguientes librerías y subrutinas bajo MIT License (MIT):
      Copyright © 2021 OpenJS Foundation and Electron contributors. <br /><br />
      <b> Exención de responsabilidad: </b>
      Los documentos y software relacionados que se publican en este programa podrían incluir
      imprecisiones técnias o errores tipográficos. RivaColdSelect se reserva el derecho a efectuar
      sin previo aviso las modificaciones que considere oportunas, pudiendo cambiar, suprimir o
      añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en
      la que estos aparezcan presentados o localizados en sus servidores.
      <br />
      RivaColdSelect declina toda responsabilidad de las consecuencias de cualquiera que sea el uso
      del software e información contenida en la aplicación, siendo en todo caso responsabilidad del
      Usuario su verificación y contrastación.
      <br />EN NINGÚN CASO RIVACOLDSELECT Y/O SUS RESPECTIVOS PROVEEDORES SERÁN RESPONSABLES POR
      NINGÚN DAÑO ESPECIAL, INDIRECTO O CONSECUENCIAL NI POR NINGÚN OTRO DAÑO CONSECUENCIA DE UNA
      FALTA DE USO, PERDIDA DE BENEFICIOS, QUE PUEDAN DERIVARSE DE UNA ACCIÓN CONTRACTUAL O
      EXTRACONTRACTUAL EN RELACION CON EL USO O EJECUCIÓN DEL SOFTWARE, DOCUMENTOS, PRESTACIÓN O
      FALTA DE PRESTACIÓN DE SERVICIOS O DE INFORMACIÓN DISPONIBLE EN ESTE SERVIDOR.
    </div>
    <div class="col-3 align-self-center" style="text-align: center; vertical-align: text-bottom">
      <div class="row justify-content-center">
        <img
          src="../assets/resources/BCSYSTEMS+RIVACOD.jpg"
          class="img-fluid"
          style="height: 80px; width: auto"
        />
      </div>
      <div class="row justify-content-center">
        <div style="font: bolder 9pt Arial">
          ©2023 Basic Connection Systems, S.L.<br />
          Todos los derechos reservados.
        </div>
      </div>
    </div>
  </div>
  <br />
</template>

<style lang="css">
@import './style.css';
</style>
