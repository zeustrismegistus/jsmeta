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

    it('does some general tests', (done) => {
	
		(function(){
			//TESTS-------------------------------------------------
			//isnullorundefined
			(function()
			{
				var u;

				if(!jsmeta.isNullOrUndefined(u))
					throw "kack!";

				if(!jsmeta.isNullOrUndefined(null))
					throw "kack!";

				if(jsmeta.isNullOrUndefined("asd"))
					throw "kack!";
			})();
			//isprimitive
			(function()
			{
				var u;
						
				if(!jsmeta.isPrimitive(u))
					throw "kack!";

				if(!jsmeta.isPrimitive(null))
					throw "kack!";

				if(!jsmeta.isPrimitive(1))
					throw "kack!";

				if(!jsmeta.isPrimitive("asdfads"))
					throw "kack!";

				if(!jsmeta.isPrimitive(true))
					throw "kack!";

				if(jsmeta.isPrimitive({}))
					throw "kack!";
			})();
			
			//isFunction
			(function()
			{
				var u;
				
				if(!jsmeta.isFunction(function(){}))
					throw "kack!";

				if(jsmeta.isFunction(null))
					throw "kack!";

				if(jsmeta.isFunction(u))
					throw "kack!";
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
				
				if(!jsmeta.hasMembers(testObj, "propA", "propB"))
					throw "kack";
				
				if(!jsmeta.hasMembers(testObj, "testFn"))
					throw "kack";
				
				if(jsmeta.hasMembers(testObj, "nonmember"))
					throw "kack";
				
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
				if(sig !==  'function testFn_fake(a,b,c,d)')
					throw "kack";
			
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
				if(!jsmeta.arrayutil.areArraysEqual(args, ['a','b','c','d']))
					throw "kack";
			
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
				
				if(args.a !== 1)
					throw "kack";
				
				if(args.b !== 2)
					throw "kack";
				
				if(args.c !== 3)
					throw "kack";
				
				if(args.d !== 4)
					throw "kack";
			
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
				
				if(!jsmeta.arrayutil.areArraysEqual(members, ['propA', 'propB', 'testFn']))
					throw "kack";

			
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
				
				if(!jsmeta.hasFunctionArgNames(testObj.testFn, ['a', 'b', 'c', 'd']))
					throw "kack";
			
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
				
				if(!jsmeta.hasSameObjectSignaturesAsTemplate(templateObj, testObj))
					throw "kack";
			
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
				
				if(!jsmeta.isValidFunctionSignature(testObj, "testFn", function(args)
				{
					return jsmeta.arrayutil.areArraysEqual(args, ['a', 'b', 'c', 'd']);
				}))
					throw "kack";
				
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
				
				if(!jsmeta.hasSameFunctionSignature(sig, sameExactSig, true))
					throw "kack";
				
				if(!jsmeta.hasSameFunctionSignature(sig, sameSig, false))
					throw "kack";
				
				if(!jsmeta.hasSameFunctionSignature(sig, sameSig))
					throw "kack";
				
				if(jsmeta.hasSameFunctionSignature(sig, diffSig1))
					throw "kack";
				if(jsmeta.hasSameFunctionSignature(sig, diffSig2))
					throw "kack";
				if(jsmeta.hasSameFunctionSignature(sig, diffSig3))
					throw "kack";
				if(jsmeta.hasSameFunctionSignature(sig, diffSig4))
					throw "kack";
				if(jsmeta.hasSameFunctionSignature(sig, diffSig5))
					throw "kack";		
			})();

			
		})();
		
		done();
    });

});