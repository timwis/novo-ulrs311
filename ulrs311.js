/*
 * Uses jQuery-JSONP library for better jsonp calls
 * https://github.com/jaubourg/jquery-jsonp
 * If that library isn't available, revert to $.ajax({dataType: 'jsonp'})
 */
var ulrs311 = {
	results: {},
	options: {
		timeout: 6000,
		min_confidence: 85,
		url_base: 'http://services.phila.gov/ulrs311/',
		url_address: 'Data/Address/',
		url_location: 'Data/Location/',
		url_service_areas: 'Data/ServiceAreas/',
		url_liaddress: 'Data/LIAddress/'
	}
}

// Empty results array
ulrs311.reset = function () {
	ulrs311.results = {};
}

// Get x/y coords and standardized address from an address
ulrs311.location = function (address, use, callback, ticket_type) {
	var url = ulrs311.options.url_base + ulrs311.options.url_location + encodeURIComponent(address);
	
	// If ticket type specified, append parameter to URL
	if(ticket_type !== undefined) {
		url = url + '/' + ticket_type;
	}
	
	// Query service
	$.jsonp({
		url: url,
		callbackParameter: 'callback',
		timeout: ulrs311.options.timeout,
		cache: true,
		success: function(data) {
			var standardized_address = null
			var xcoord = null;
			var ycoord = null;
			
			// If any results were returned
			if(data['Locations'] !== undefined && data.Locations.length) {
				// Loop through results
				for(var i = 0; i < data.Locations.length; i++) {
					// On the first result that meets our minimum confidence score, store its data and stop looping
					if(data.Locations[i].Address.Similarity >= ulrs311.options.min_confidence) {
						standardized_address = data.Locations[i].Address.StandardizedAddress;
						xcoord = data.Locations[i].XCoord;
						ycoord = data.Locations[i].YCoord;
						break;
					}
				}
			}
			// If we want to use the standardized address from this query, store it in the results
			// If no results found, it will set it to null
			// Also, if no results were found, we want to set it to null anyway to void the L&I address format search
			if(use.indexOf('standardized_address') != -1 || standardized_address == null) {
				ulrs311.results.standardized_address = standardized_address;
			}
			// If we want the x/y coords from this query, store it in the results
			// If no results found, it will set them to null
			if(use.indexOf('xy') != -1) {
				ulrs311.results.xcoord = xcoord;
				ulrs311.results.ycoord = ycoord;
			}
			callback('location');
		},
		error: function() {
			// Set the results we wanted to null
			if(use.indexOf('standardized_address') != -1) {
				ulrs311.results.standardized_address = null;
			}
			if(use.indexOf('xy') != -1) {
				ulrs311.results.xcoord = null;
				ulrs311.results.ycoord = null;
			}
			callback('location error');
		}
	});
}

ulrs311.service_areas = function (address, callback) {
	var url = ulrs311.options.url_base + ulrs311.options.url_service_areas + encodeURIComponent(address);
	//var url = 'http://geoweb.phila.gov/geospatial.webservices/GISService.asmx/GetServiceAreasByAddress?clientName=Novo%20test&serviceAreaIDs=whatever&address=1234%20Market%20street';
	$.jsonp({
		url: url,
		callbackParameter: 'callback',
		timeout: ulrs311.options.timeout,
		cache: true,
		success: function(data) {
			var service_areas = {};
			if(data['ServiceAreas'] !== undefined && data.ServiceAreas.length) {
				for(var i = 0; i < data.ServiceAreas.length; i++) {
					if(data.ServiceAreas[i] != null) {
						service_areas[data.ServiceAreas[i].Area.ID] = data.ServiceAreas[i].Value;
					}
				}
			}
			ulrs311.results.service_areas = service_areas;
			callback('service_areas');
		},
		error: function(xhr, status) {
			ulrs311.results.service_areas = null;
			callback('service_areas error ' + xhr.status + ' ' + status);
		}
	});
}

ulrs311.liaddress = function (address, callback, suffix) {
	var url = ulrs311.options.url_base + ulrs311.options.url_liaddress + encodeURIComponent(address);
	$.jsonp({
		url: url,
		callbackParameter: 'callback',
		timeout: ulrs311.options.timeout,
		cache: true,
		success: function(data) {
			// If error
			if(data.indexOf('No L&I Address Exists') != -1) {	
				ulrs311.results.standardized_address = null;
			}
			else {
				// If the address failed to geocode, the property would already be set (as null), and we don't want to overwrite it
				// This would happen on a bogus address like 'asdf' (fail to geocode but success in /LIAddress/
				if( ! ulrs311.results.hasOwnProperty('standardized_address')) {
					ulrs311.results.standardized_address = $.trim(data.replace(/ +(?= )/g,''));
					if(suffix) ulrs311.results.standardized_address += suffix; // Append suffix if there is one
				}
			}
			callback('liaddress');
		},
		error: function() {
			ulrs311.results.standardized_address = null;
			callback('liaddress error');
		}
	});
}

/*
 * IE Compatibility
 */
if( !Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt /*, from*/) {
		var len = this.length >>> 0;
		var from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0) from += len;
		for(; from < len; from++) {
			if (from in this && this[from] === elt)
				return from;
		}
		return -1;
	};
}