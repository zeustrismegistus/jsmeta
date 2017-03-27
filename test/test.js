const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Code.expect;

var jsmeta = require('./../jsmeta.js');

describe('jsmeta', () => {

	var builder;

    before((done) => {
        done();
    });

    after((done) => {
        done();
    });

	it('tests arrayutil', (done) => {
	 
	 
		"use strict";
		
		var arrEmpty = [];
		
		expect(jsmeta.arrayutil.areArraysEqual(null,null)).to.equal(true);
		expect(jsmeta.arrayutil.areArraysEqual(undefined,undefined)).to.equal(true);
		expect(jsmeta.arrayutil.areArraysEqual(arrEmpty,arrEmpty)).to.equal(true);
		expect(jsmeta.arrayutil.areArraysEqual(null,undefined)).to.equal(false);
		expect(function(){ return jsmeta.arrayutil.areArraysEqual({},[]);}).to.throw(Error, 'not array');
		expect(function(){ return jsmeta.arrayutil.areArraysEqual([],{});}).to.throw(Error, 'not array');	
		expect(jsmeta.arrayutil.areArraysEqual([],[1])).to.equal(false);
		
		var arrABC = ['A','B','C'];
		var arrABC2 = ['A','B','C'];
		var arrABD = ['A','B','D'];
		
		expect(jsmeta.arrayutil.areArraysEqual(arrABC,arrABC2)).to.equal(true);
		expect(jsmeta.arrayutil.areArraysEqual(arrABC,arrABD)).to.equal(false);
		
		var arrABCDEF = ['A','B','C', 'D', 'E', 'F'];
		var diff = jsmeta.arrayutil.removeSet(arrABCDEF, arrABC);
		expect(jsmeta.arrayutil.areArraysEqual(diff, ['D','E','F'])).to.equal(true);
		
		expect(jsmeta.arrayutil.removeSet(null, null)).to.equal([]);
		expect(jsmeta.arrayutil.removeSet([],null)).to.equal([]);
			
		done();
    });	
	
    it('does some general tests', (done) => {
	
		(function(){
			//TESTS-------------------------------------------------
			//isnullorundefined
			(function()
			{
				var u;

				expect(jsmeta.isNullOrUndefined(u)).to.equal(true);
				expect(jsmeta.isNullOrUndefined(null)).to.equal(true);
				expect(jsmeta.isNullOrUndefined()).to.equal(true);
				expect(jsmeta.isNullOrUndefined(undefined)).to.equal(true);
				expect(jsmeta.isNullOrUndefined("asd")).to.equal(false);
			
			})();
			//isprimitive
			(function()
			{
				var u;
				
				expect(jsmeta.isPrimitive(u)).to.equal(true);
				expect(jsmeta.isPrimitive(null)).to.equal(true);
				expect(jsmeta.isPrimitive(undefined)).to.equal(true);
				expect(jsmeta.isPrimitive()).to.equal(true);
				expect(jsmeta.isPrimitive(1)).to.equal(true);
				expect(jsmeta.isPrimitive("asdfads")).to.equal(true);
				expect(jsmeta.isPrimitive(true)).to.equal(true);
				expect(jsmeta.isPrimitive({})).to.equal(false);
				expect(jsmeta.isPrimitive([])).to.equal(true);
				expect(jsmeta.isPrimitive(Symbol('a'))).to.equal(true);
				
			})();
			
			//isEmpty
			(function()
			{
				expect(jsmeta.isEmpty({})).to.equal(true);
				expect(jsmeta.isEmpty({a:'a', b:'b'})).to.equal(false);
						
			})();
			
			//isFunction
			(function()
			{
				var u;
				
				expect(jsmeta.isFunction(function(){})).to.equal(true);
				expect(jsmeta.isFunction(null)).to.equal(false);
				expect(jsmeta.isFunction(u)).to.equal(false);
				expect(jsmeta.isFunction({})).to.equal(false);
			})();
			
			//hasMembers
			(function()
			{
				//build test object
				var testObj = {
					propA : 'A',
					propB : 'B',
					testFn : function testFn_fake(a,b,c,d){

						//do nothing
						var rv = a + b +c +d;
						return rv;
					}
				};
				
				expect(jsmeta.hasMembers(testObj, "propA", "propB")).to.equal(true);
				expect(jsmeta.hasMembers(testObj, "testFn")).to.equal(true);
				expect(jsmeta.hasMembers(testObj, "nonmember")).to.equal(false);
				expect(function(){return jsmeta.hasMembers(null, "nonmember");}).to.throw(Error, "nullOrUndefined");
				
			})();
			
			//getFunctionRawSignature
			(function()
			{
				//build test object
				var testObj = {
					propA : 'A',
					propB : 'B',
					testFn : function testFn_fake(a,b,c,d){

						//do nothing
						var rv = a + b +c +d;
						return rv;
					}
				};
				
				var sig = jsmeta.getFunctionRawSignature(testObj.testFn);
				expect(sig).to.equal('function testFn_fake(a,b,c,d)');
				expect(function(){return jsmeta.getFunctionRawSignature(null);}).to.throw(Error, "not a function");
			})();
			
			//getFunctionArgNamesAsArray
			(function()
			{
				//build test object
				var testObj = {
					propA : 'A',
					propB : 'B',
					testFn : function testFn_fake(a,b,c,d){

						//do nothing
						var rv = a + b +c +d;
						return rv;
					}
				};
				
				var args = jsmeta.getFunctionArgNamesAsArray(testObj.testFn);
				expect(jsmeta.arrayutil.areArraysEqual(args, ['a','b','c','d'])).to.equal(true);
				
				expect(function(){return jsmeta.getFunctionArgNamesAsArray(null);}).to.throw(Error, "not a function");
				expect(jsmeta.arrayutil.areArraysEqual(jsmeta.getFunctionArgNamesAsArray(function(){}), [])).to.equal(true);
			})();
			
			//convertFunctionArgsToMap
			(function()
			{
				//build test object
				var testObj = {
					propA : 'A',
					propB : 'B',
					testFn : function testFn_fake(a,b,c,d){

						//do nothing
						var rv = a + b +c +d;
						return rv;
					}
				};
				
				var args = jsmeta.convertFunctionArgsToMap(testObj.testFn, [1 , 2, 3, 4]);
				
				expect(args.a).to.equal(1);
				expect(args.b).to.equal(2);
				expect(args.c).to.equal(3);
				expect(args.d).to.equal(4);
			
				expect(function(){return jsmeta.convertFunctionArgsToMap({}, []);}).to.throw(Error, "not a function");
				expect(jsmeta.convertFunctionArgsToMap(function(){},[])).to.equal({});
				expect(jsmeta.convertFunctionArgsToMap(function(){},null)).to.equal({});
				expect(jsmeta.convertFunctionArgsToMap(function(){},[1])).to.equal({});
			})();
			
			//getMemberNamesAsArray
			(function()
			{
				//build test object
				var testObj = {
					propA : 'A',
					propB : 'B',
					testFn : function testFn_fake(a,b,c,d){

						//do nothing
						var rv = a + b +c +d;
						return rv;
					}
				};
				
				var members = jsmeta.getMemberNamesAsArray(testObj);
				
				expect(jsmeta.arrayutil.areArraysEqual(members, ['propA', 'propB', 'testFn'])).to.equal(true);
				expect(function(){return jsmeta.getMemberNamesAsArray(null);}).to.throw(Error, "nullOrUndefined");
			
			})();
			
			
			//hasFunctionArgNames
			(function()
			{
				//build test object
				var testObj = {
					propA : 'A',
					propB : 'B',
					testFn : function testFn_fake(a,b,c,d){

						//do nothing
						var rv = a + b +c +d;
						return rv;
					}
				};
				
				expect(jsmeta.hasFunctionArgNames(testObj.testFn, ['a', 'b', 'c', 'd'])).to.equal(true);
				expect(jsmeta.hasFunctionArgNames(function(){}, [])).to.equal(true);
				
				expect(function(){return jsmeta.hasFunctionArgNames(null);}).to.throw(Error, "not a function");
				expect(jsmeta.hasFunctionArgNames(function(){}, ['a','b'])).to.equal(false);
				expect(function(){return jsmeta.hasFunctionArgNames(function(){},{});}).to.throw(Error, "not an array");
				
				
			})();
			
			//hasSameObjectSignaturesAsTemplate
			(function()
			{
				//build template object
				var templateObj = {
					propA : 'A',
					propB : 'B',
					testFn : function testFn_fake(a,b,c,d){
						var rv = a + b +c +d;
						return rv;
					}
				};
				
				//build test object
				var testObj = {
					propA : 'B',
					propB : 'C',
					testFn : function testFn_fake2(a,b,c,d){
						//do nothing
					}
				};
				
				expect(jsmeta.hasSameObjectSignaturesAsTemplate(templateObj, testObj)).to.equal(true);
				expect(function(){return jsmeta.hasSameObjectSignaturesAsTemplate(null,testObj);}).to.throw(Error, "nullOrUndefined");
				expect(function(){return jsmeta.hasSameObjectSignaturesAsTemplate(templateObj,null);}).to.throw(Error, "nullOrUndefined");
				expect(jsmeta.hasSameObjectSignaturesAsTemplate(templateObj, testObj, [])).to.equal(true);
				expect(jsmeta.hasSameObjectSignaturesAsTemplate(templateObj, testObj, ['propA'])).to.equal(true);
				expect(jsmeta.hasSameObjectSignaturesAsTemplate({a:function(a,b,c){}}, {a:function(a,b){}})).to.equal(false);
				expect(jsmeta.hasSameObjectSignaturesAsTemplate({a:function(a,b,c){}}, {b:function(a,b){}})).to.equal(false);
				expect(jsmeta.hasSameObjectSignaturesAsTemplate({a:function(a,b,c){}}, {b:function(a,b){}}, ['a'])).to.equal(true);
				expect(jsmeta.hasSameObjectSignaturesAsTemplate({a:function(a,b,c){}}, {b:function(a,b){}}, ['b'])).to.equal(false);
				expect(jsmeta.hasSameObjectSignaturesAsTemplate({a:function(a,b,c){}}, {b:3}, ['b'])).to.equal(false);			
				expect(function(){return jsmeta.hasSameObjectSignaturesAsTemplate(templateObj,{},{});}).to.throw(Error, "not an array");
				
				
				expect(jsmeta.hasSameObjectSignaturesAsTemplate({a:function(a,b,c){}}, {a:function(a,b,c){}}, [])).to.equal(true);
				expect(jsmeta.hasSameObjectSignaturesAsTemplate({a:function(a,b,c){}}, {a:1}, [])).to.equal(false);
				
			})();
			
			
			//isValidFunctionSignature
			(function()
			{
				//build test object
				var testObj = {
					propA : 'A',
					propB : 'B',
					testFn : function testFn_fake(a,b,c,d){

						//do nothing
						var rv = a + b +c +d;
						return rv;
					}
				};
				
				expect(jsmeta.isValidFunctionSignature(testObj, "testFn", function(args)
				{
					return jsmeta.arrayutil.areArraysEqual(args, ['a', 'b', 'c', 'd']);
				})).to.equal(true);
				
				expect(function(){return jsmeta.isValidFunctionSignature(null, null, null);}).to.throw(Error, "nullOrUndefined");
				expect(function(){return jsmeta.isValidFunctionSignature({}, null, null);}).to.throw(Error, "nullOrUndefined");
				expect(function(){return jsmeta.isValidFunctionSignature({a:'a'}, 'a', null);}).to.throw(Error, "nullOrUndefined");
				expect(jsmeta.isValidFunctionSignature({a:'a'}, 'b', function(args){return true;})).to.equal(false);
				expect(jsmeta.isValidFunctionSignature({a:'a'}, 'a', function(args){return true;})).to.equal(false);
				expect(jsmeta.isValidFunctionSignature({a:'a'}, 'a', function(args){throw "kack";})).to.equal(false);
				expect(jsmeta.isValidFunctionSignature({a:'a'}, 'a', function(args){return false;})).to.equal(false);
				expect(jsmeta.isValidFunctionSignature({a:function(a,b,c){}}, 'a', function(args){return false;})).to.equal(false);
				expect(jsmeta.isValidFunctionSignature({a:function(a,b,c){}}, 'a', function(args){throw "kack";})).to.equal(false);				
			})();
			
			//hasSameFunctionSignature
			(function()
			{
				//build test object
				var sig = function testFn_fake(a,b,c,d){};
				var sameExactSig =  function testFn_fake(a,b,c,d){};
				var sameSig = function testFn_fake2(a,b,c,d){};
				var diffSig1 = function testFn_fake2(a,b,c){};
				var diffSig2 = function testFn_fake2(a,b,c,d, e){};
				var diffSig3 = function testFn_fake2(a,b,c,e){};
				var diffSig4 = function testFn_fake2(a1,b,c,d){};
				var diffSig5 = function testFn_fake2(){};
				
				expect(jsmeta.hasSameFunctionSignature(sig, sameExactSig, true)).to.equal(true);
				expect(jsmeta.hasSameFunctionSignature(sig, sameSig, false)).to.equal(true);
				expect(jsmeta.hasSameFunctionSignature(sig, sameSig)).to.equal(true);
				
				expect(jsmeta.hasSameFunctionSignature(sig, diffSig1)).to.equal(false);
				expect(jsmeta.hasSameFunctionSignature(sig, diffSig2)).to.equal(false);
				expect(jsmeta.hasSameFunctionSignature(sig, diffSig3)).to.equal(false);
				expect(jsmeta.hasSameFunctionSignature(sig, diffSig4)).to.equal(false);
				expect(jsmeta.hasSameFunctionSignature(sig, diffSig5)).to.equal(false);
	
				expect(function(){return jsmeta.hasSameFunctionSignature(null, diffSig5);}).to.throw(Error, "nullOrUndefined");
				expect(function(){return jsmeta.hasSameFunctionSignature(diffSig5, null);}).to.throw(Error, "nullOrUndefined");
				
				expect(function(){return jsmeta.hasSameFunctionSignature({}, diffSig5);}).to.throw(Error, "not a function");
				expect(function(){return jsmeta.hasSameFunctionSignature(diffSig5, {});}).to.throw(Error, "not a function");
								
			})();

			//validators
			(function()
			{
				expect(function(){return jsmeta.validators.validateNotUndefined();}).to.throw(Error, "undefined");
				expect(jsmeta.validators.validateNotUndefined(null)).to.equal(undefined);
				expect(jsmeta.validators.validateNotUndefined({})).to.equal(undefined);
				expect(jsmeta.validators.validateNotUndefined(7)).to.equal(undefined);
				
				expect(function(){return jsmeta.validators.validateNotNull(null);}).to.throw(Error, "null");
				expect(jsmeta.validators.validateNotNull()).to.equal(undefined);
				expect(jsmeta.validators.validateNotNull({})).to.equal(undefined);
				expect(jsmeta.validators.validateNotNull(7)).to.equal(undefined);
				
				
				expect(function(){return jsmeta.validators.validateNotNullOrUndefined();}).to.throw(Error, "undefined");
				expect(function(){return jsmeta.validators.validateNotNullOrUndefined(null);}).to.throw(Error, "null");
				expect(function(){return jsmeta.validators.validateNotNullOrUndefined(undefined);}).to.throw(Error, "undefined");
				
				expect(function(){return jsmeta.validators.validateIsFunction({});}).to.throw(Error, "not function");
				
				expect(function(){return jsmeta.validators.validateIsArray({});}).to.throw(Error, "not array");
				expect(jsmeta.validators.validateIsArray([])).to.equal(undefined);
				
				expect(function(){return jsmeta.validators.assert(null);}).to.throw(Error, "null");
				expect(function(){return jsmeta.validators.assert();}).to.throw(Error, "undefined");
				expect(function(){return jsmeta.validators.assert({});}).to.throw(Error, "not function");				
			
				expect(function(){return jsmeta.validators.assert(function(){return false;});}).to.throw(Error, "invalid assertion");		
				expect(jsmeta.validators.assert(function(){return true;})).to.equal(undefined);
						
			})();
		})();
		
		done();
    });


    it('json serializes', (done) => {
	 
	 
		"use strict";
		var ccDecObj = {};
		ccDecObj.a = "asdfads";
		ccDecObj.b = "adfasd";
		ccDecObj.c = new Date();
		ccDecObj.d = [[1,2,3],[4,5, [6,7],[]]];
		ccDecObj.e = 12.45;
		ccDecObj.fn = function(a,b,c){return "adsfads" + a + b + c;};
		ccDecObj.g = {};
		ccDecObj.h = null;
		ccDecObj.i = undefined;
		ccDecObj.j = {a:1}
		ccDecObj.k = ccDecObj.j;
		ccDecObj.l = true;
		ccDecObj.m = Symbol('yo');
		ccDecObj.n = {a:{a:1}};
		//serialize
		var objDat = jsmeta.JSONSerializer.serialize(ccDecObj);
		
		var ccDecObj2 = jsmeta.JSONSerializer.deserialize(objDat);
		
		expect(ccDecObj2.a).to.equal(ccDecObj.a);
		expect(ccDecObj2.b).to.equal(ccDecObj.b);
		expect(ccDecObj2.c.getTime()).to.equal(ccDecObj.c.getTime());
		expect(ccDecObj2.e).to.equal(ccDecObj.e);
		expect(ccDecObj2.g).to.equal({});
		expect(ccDecObj2.h).to.equal(null);
		expect(ccDecObj2.i).to.equal(undefined);
		
		
		var objDat2 = jsmeta.JSONSerializer.serialize(ccDecObj2);
		expect(objDat2).to.equal(objDat);

		//run the function
		expect(ccDecObj2.fn(1,2,3)).to.equal("adsfads123")
		expect(function(){return jsmeta.JSONSerializer.deserialize('throw new Error(3);');}).to.throw(Error,3); 
		
		var emptyDat = jsmeta.JSONSerializer.serialize({});
		var empty = jsmeta.JSONSerializer.deserialize(emptyDat);
		expect(jsmeta.isEmpty(empty)).to.equal(true);
		done();
    });	
});