(function () {

	const ArrayUtil = 
	{
		areArraysEqual : function(a,b) 
		{
			if (a === b) return true;
			if (a == null || b == null) return false;
			
			if(!Array.isArray(a))
				throw new Error("not array");
			
			if(!Array.isArray(b))
				throw new Error("not array");
			
			if (a.length != b.length) return false;

			// If you don't care about the order of the elements inside
			// the array, you should sort both arrays here.

			for (var i = 0; i < a.length; ++i) {
				if (a[i] !== b[i]) return false;
			}
			
			return true;
		},
		removeSet : function(source, toRemove)
		{
			if (source === null) return [];
			if (toRemove === null) return source.slice();
		
			var rv = source.filter(function(item)
			{
				return toRemove.indexOf(item) < 0;
			});
			
			return rv;
		}
	};
	
	(function(){
		//lock it down
		Object.freeze(ArrayUtil);
	})();

	const JSMeta = 
	{
		/*primative is tests------------------------------------------*/
		isNull : function(val)
		{
			"use strict";
			return val === null;
		},
		isUndefined : function(val)
		{
			"use strict";
			return val === undefined;
		},
		isNullOrUndefined : function(val)
		{
			"use strict";
			return JSMeta.isUndefined(val)  || JSMeta.isNull(val);
		},
		isEmpty : function(val)
		{
			//ECMA5+ 
			return Object.keys(val).length === 0 && val.constructor === Object;
			/*
			for(var prop in val) 
			{
				if(val.hasOwnProperty(prop))
					return false;
			}

			return JSON.stringify(val) === JSON.stringify({});
			*/
		},
		/*is something a javascript primitive type or an array*/
		isPrimitive : function(val)
		{
			"use strict";
				
			if(JSMeta.isNullOrUndefined(val))
				return true;
			
			var valType = typeof val;

			var rv = false;
			
			if(valType === "boolean")
			{
				rv = true;
			}
			else if (valType === "number")
			{
				rv = true;
			}
			else if (valType === "string")
			{
				rv = true;
			}
			else if (valType === "symbol")
			{
				rv = true;
			}
			else if(Array.isArray(val))
			{
				rv = true;
			}
			return rv;
		},
		isFunction : function (obj)
		{    
			"use strict";
			if(JSMeta.isNullOrUndefined(obj))
				return false;
			
			if(typeof obj !== "function")
				return false;
			
			return true;
		},
		/* reflection utilities ---------------------------------------------------------*/
		getMemberNamesAsArray : function(obj)
		{    
			"use strict";
			if(JSMeta.isNullOrUndefined(obj))
				throw new Error("nullOrUndefined");
			
			var rv = [];
			for(var p in obj)
			{
				rv.push(p);
			}
			return rv;
		},
		/* does the object have the provided properties */
		hasMembers : function(/* object to test membership on */ obj /*, list of members */)
		{    
			"use strict";
			if(JSMeta.isNullOrUndefined(obj))
				throw new Error("nullOrUndefined");
			
			var args = arguments;
			for(var i=1;i<args.length;i++)
			{
				if(!obj.hasOwnProperty(args[i]))
					return false;
			}
			return true;
		},
		/*function reflection ---------------------------------------------------*/
		/* parses the raw function signature */
		getFunctionRawSignature : function(func)
		{   
			"use strict";
			if(!JSMeta.isFunction(func))
				throw new Error("not a function");
			
			//parse to 1st "{"
			var origText = func.toString();
			var sig = origText.split('{',1)[0];
			
			//scrub trailing whitespace
			sig = sig.trim();

			return sig;
		},
		/* parses the function text to get a list of argument names */
		getFunctionArgNamesAsArray : function(func) 
		{   
			"use strict";
			if(!JSMeta.isFunction(func))
				throw new Error("not a function");
			
			// First match everything inside the function argument parens.
			var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

			// Split the arguments string into an array comma delimited.
			return args.split(',').map(function(arg) {
				// Ensure no inline comments are parsed and trim the whitespace.
				return arg.replace(/\/\*.*\*\//, '').trim();
			}).filter(function(arg) {
				// Ensure no undefined values are added.
				return arg;
			})
		},
		hasSameFunctionSignature : function(fnA, fnB, isStrict)
		{    
			"use strict";
			if(JSMeta.isNullOrUndefined(fnA))
				throw new Error("nullOrUndefined");
			if(JSMeta.isNullOrUndefined(fnB))
				throw new Error("nullOrUndefined");

			if(!JSMeta.isFunction(fnA))
				throw new Error("not a function");
			if(!JSMeta.isFunction(fnB))
				throw new Error("not a function");


			//run a strict mode compare
			if(isStrict)
			{
				var sigA = JSMeta.getFunctionRawSignature(fnA);
				var sigB = JSMeta.getFunctionRawSignature(fnB);
				
				return sigA === sigB;
			}

			//otherwise just compare argument names
			var namesA = JSMeta.getFunctionArgNamesAsArray(fnA);
			var namesB = JSMeta.getFunctionArgNamesAsArray(fnB);
			
			if(!ArrayUtil.areArraysEqual(namesA, namesB))
				return false;
			
			return true;
		},
		/* converts an arguments array into a map using the parsed argument names as keys*/
		convertFunctionArgsToMap : function(func, args)
		{    
			"use strict";
			if(!JSMeta.isFunction(func))
				throw new Error("not a function");
			
			var rv = {};
			
			//if there are no args, there is no return data
			if(JSMeta.isNullOrUndefined(args))
				return rv;
			
			//parse the arg names
			var argNames = JSMeta.getFunctionArgNamesAsArray(func);
			
			//if there are no names for the map, there is no return data
			if(argNames.length == 0)
				return rv;
			
			for(var i=0; i < argNames.length; i++)
			{
				rv[argNames[i]] = args[i];    
			}

			return rv;
		},


		/* does the function have the provided args in the specified order */
		hasFunctionArgNames : function( /*expects a function */ func, /* expects an array of names */ expectedArgNames)
		{    
			"use strict";
			if(!JSMeta.isFunction(func))
				throw new Error("not a function");
			
			if(!Array.isArray(expectedArgNames))
				throw new Error("not an array");
			
			var argNames = JSMeta.getFunctionArgNamesAsArray(func);
			
			return ArrayUtil.areArraysEqual(argNames, expectedArgNames);
		},
			/* 
			examines obj to see if a function of name exists, and if its args pass the validation function
		*/
		isValidFunctionSignature : function(obj, name, /* function(argNames) */ argValidationFn)
		{    
			"use strict";
			if(JSMeta.isNullOrUndefined(obj))
				throw new Error("nullOrUndefined");
			if(JSMeta.isNullOrUndefined(name))
				throw new Error("nullOrUndefined");
			if(JSMeta.isNullOrUndefined(argValidationFn))
				throw new Error("nullOrUndefined");
		   
			//does the member exist?
			if(!JSMeta.hasMembers(obj, name))
				return false;
			
			//is it a function?
			var fn = obj[name];
			if(!JSMeta.isFunction(fn))
				return false;
			
			//get the args
			var argNames = JSMeta.getFunctionArgNamesAsArray(obj[name]);
			
			//do the args validate?
			try
			{    
				if(!argValidationFn(argNames))
					return false;
			}
			catch(e)
			{
				return false;    
			}
			return true;
		},
		/*object meta ----------------------------------------------------------*/
		/*  has same member names && functions have same signatures.  uses templateObj as the members to query for */
		hasSameObjectSignaturesAsTemplate : function(templateObj, testObj, /* expects array of members to ignore*/ excludeList)
		{    
			"use strict";
			if(JSMeta.isNullOrUndefined(templateObj))
				throw new Error("nullOrUndefined");
			if(JSMeta.isNullOrUndefined(testObj))
				throw new Error("nullOrUndefined");

			if(excludeList)
				if(!Array.isArray(excludeList))
					throw new Error("not an array");
				
			var hasExclusions = !!excludeList;
			
			for(var p in templateObj)
			{
				if(hasExclusions)
					if(excludeList.indexOf(p) > -1)
						continue;
				
				if(!(p in testObj))
					return false;

				var templateMember = templateObj[p];
				if(JSMeta.isFunction(templateMember))
				{
					var testMember = testObj[p];
					if(JSMeta.isFunction(testMember))
					{
						var templateArgs = JSMeta.getFunctionArgNamesAsArray(templateMember);
						var testMemberArgs = JSMeta.getFunctionArgNamesAsArray(testMember);
					
						if(!JSMeta.arrayutil.areArraysEqual(templateArgs, testMemberArgs))
							return false;
					
					}
					else
					{
						return false;
					}
				}
			}

			return true;
		}
	};
	(function(){
		
		JSMeta.arrayutil = ArrayUtil;
	})();

	const Validators = 
	{
		validateNotUndefined : function (obj)
		{  
			"use strict";
			if(obj === undefined)
				throw new Error("undefined");
		},
		validateNotNull : function (obj)
		{   
			"use strict";
			if(obj === null)
				throw new Error("null");
		},
		validateNotNullOrUndefined : function(obj)
		{   
			"use strict";
			Validators.validateNotUndefined(obj);
			Validators.validateNotNull(obj);
		},
		validateIsFunction : function (expectedFn)
		{  
			"use strict";
			if(!JSMeta.isFunction(expectedFn))
				throw new Error("not function");
		},
		validateIsArray : function(expectedArray)
		{
			"use strict";
			Validators.validateNotNullOrUndefined(expectedArray);
			
			if(!Array.isArray(expectedArray))
				throw new Error("not array");
		},
		assert : function( /* assertion function returns bool*/ assertionFn)
		{   
			"use strict";
			Validators.validateNotNullOrUndefined(assertionFn);
			Validators.validateIsFunction(assertionFn);
			
			var rv = assertionFn();
			if(!rv)
				throw new Error("invalid assertion");
		}

	};

	(function(){
		//lock it down
		Object.freeze(Validators);   

		JSMeta.validators = Validators;
	
	})();
	
	
	const JSONSerializer = 
	{
		deserialize : function(data)
		{
			try
			{
				var rv = (function()
				{
					var x;
					eval("x = " + data + ";");
					return x;
				})();
				return rv;
			}
			catch(e)
			{
				console.log("error deserializing ");
				console.log(data);
				console.log(e);
				
				throw e;
			}
		},
		serialize : function (obj)
		{
			//as we walk the graph we keep track of the things we're serializing so that we avoid endless/wasted loops if the graph has circular references
			var serializedRegistry = 
			{
				registry : [],
				register : function(source, text)
				{
					var item = { source: source, text: text};
					this.registry.push(item);
				},
				getSerialized : function(source)
				{
					var rv = null;
					for(var i = 0; i< this.registry.length; i++)
					{
						var item = this.registry[i];
						if(item.source == source)
						{
							rv = item.text;
							break;
						}
					}
					return rv;
				}
			};
			
			var serializeFn = function(val)
			{
				//handle all primitive types first

				if(val === undefined)
					return "undefined";

				if(val === null)
					return "null";
				
				var valType = typeof val;

				if(valType === "boolean")
				{
					return val.toString();
				}
				else if (valType === "number")
				{
					return val.toString();
				}
				else if (valType === "string")
				{
					return "\x22" + val + "\x22";
				}
				else if (valType === "symbol")
				{
					return "\x22" + val.toString() + "\x22";
				}
				else if(valType === "function")
				{
					return val.toString();
				}
				else if(val instanceof Date)
				{
					return "new Date(" + val.getTime() + ")";  
				}
				else if(val instanceof Array)
				{
					
					var valString = "[";
					
					if(val.length > 0)
					{
						for(var i=0; i<val.length -1;i++)
						{
							//recurse!
							valString += serializeFn(val[i]);
							valString += ",";
						}			
						
						valString += serializeFn(val[val.length - 1]);
					}
					valString += "]";
				}
				else if(JSMeta.isEmpty(val))
				{
					return "{}";
				}
				else		
				{
					//do object serialization
					
					//check if already registered
					var rv = serializedRegistry.getSerialized(val);
				
					if(rv !== null)
					{
						return rv;    
					}
					
					//build it up
					
					var valString = "{";
					for(var p in val)
					{
						var member = val[p];
						var memberName = p;

						valString += memberName + ":" + serializeFn(member) + ",";
					}
					
					valString = valString.substr(0, valString.length - 1);

					valString += "}";
	  
					//register it
					serializedRegistry.register(val, valString);
					return valString;
				}

			};
			
			return serializeFn(obj);
		} 
	};

	(function(){
		//lock it down
		Object.freeze(JSONSerializer);
		
		JSMeta.JSONSerializer = JSONSerializer;
		
		//lock it down
		Object.freeze(JSMeta); 	
		
	})();
	//wire up the exports
	/* $lab:coverage:off$ */
	
	// Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = JSMeta;
    }
    // AMD / RequireJS
    else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return JSMeta;
        });
    }
    // included directly via <script> tag
    else {
        this.jsmeta = JSMeta;
    }
	/* $lab:coverage:on$ */
	
})();
	
