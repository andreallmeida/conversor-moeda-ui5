sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
	"use strict";

	return Controller.extend("alca.conversor-moeda-ui5.controller.S0", {
		onInit: function () {

			var oModelData = {

				moedaOrigem: [{
					key: 'EUR',
					text: 'Euro'
				}, {
					key: 'USD',
					text: 'Dolar Americano'
				}, {
					key: 'CAD',
					text: 'Dolar Canadense'
				}, {
					key: 'BRL',
					text: 'Real'
				}],
				moedaOrigemSelecionada: "EUR",

				moedaDestino: [{
					key: 'EUR',
					text: 'Euro'
				}, {
					key: 'USD',
					text: 'Dolar Americano'
				}, {
					key: 'BRL',
					text: 'Real'
				}],
				moedaDestinoSelecionada: "USD",

				dateConversion: new Date()
				
			};

			// Generate new JSON Model (input)
			this._oModel = new JSONModel(oModelData);
			this.getView().setModel(this._oModel, "input");

			// Generate new JSON Model (output)
			this._oModelOutput = new JSONModel();
			this.getView().setModel(this._oModelOutput, "output");

			// Registra funcão para quando requisição terminar
			this._oModelOutput.attachRequestCompleted(this.onRequestCompleted, this);

		},

		onRequestCompleted: function (oEvent) {

			// Cria array local para agrupamento dos novos registros 
			var aNewRecords = [];

			// Sucesso
			if (oEvent.getParameters().success) {

				var oNewRecord = {};
				var sMoedaOrigem = this._oModel.getProperty("/moedaOrigemSelecionada");
				var sMoedaDestino = this._oModel.getProperty("/moedaDestinoSelecionada");
				
				oNewRecord.convOrigem = sMoedaOrigem;
				oNewRecord.convDestino = sMoedaDestino;
				oNewRecord.convValor = this._oModelOutput.getData().rates[sMoedaDestino];
				oNewRecord.convData = this._oModelOutput.getData().date;
				aNewRecords.push(oNewRecord);

				// Erro no Processamento	
			} else {
				
				MessageBox.alert("Erro na API");
				
			}

			this._oModelOutput.setProperty("/convertedData", aNewRecords);
		},

		onConvertPress: function (oControlEvent) {

			var sMoedaOrigem = this._oModel.getProperty("/moedaOrigemSelecionada");
			var sMoedaDestino = this._oModel.getProperty("/moedaDestinoSelecionada");

			// Objeto para Parametros de URL
			var oParam = {};
			oParam.base = sMoedaOrigem;
			oParam.symbols = sMoedaDestino;

			var sPrefix = "/CurrencyApi/";
			var sDate = this._oModel.getProperty("/dateConversion");
			var sUrl = sPrefix + sDate.toISOString().substr(0, 10);

			// Atualiza JSON MODEL com conteúdo de nova chamada
			this._oModelOutput.loadData(sUrl, oParam);

		}
	});
});