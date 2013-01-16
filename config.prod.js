var DEBUG = false;
var PATH_NAME = '/admin/editcase.asp';
var TEMPLATES = {
	service_request: 11,
	public_site: 12,
	mobile: 18,
	smoke_alarm: 20
};
var NODES = {
	template: 'select[name="dCase$TEMPLATE_REF"]',
	input_address: 'input[name="dFormUdf$17"]',
	department: 'select[name="dCase$DEPART_REF"]',
	category: 'select[name="dCase$CATEGORY_REF"]',
	standardized_address: 'input[name="dFormUdf$17"]',
	//verified: 'input[name="dFormUdf$79"]',
	//label_verified: 'label[for="dFormUdf$791"], label[for="dFormUdf$79"]',
	verified: 'select[name="UDFDATE95"]',
	label_verified: 'label:contains(Address Verification)',
	xcoord: 'input[name="dFormUdf$81"]',
	label_xcoord: 'label[for="dFormUdf$811"], label[for="dFormUdf$81"]',
	ycoord: 'input[name="dFormUdf$80"]',
	label_ycoord: 'label[for="dFormUdf$801"], label[for="dFormUdf$80"]',
	citycouncil: 'select[name="UDFDATE23"]',
	police: 'select[name="UDFDATE75"]',
	phillyrising: 'select[name="UDFDATE85"]'
};
var NODE_VALUES = {
	category_vacant_lot: '208',
	department_li: '51',
	department_streets: '15'
};
var TABLES = {
	verified: {
		'default': '0',
		'verified': '623',
		'override': '624',
		'down': '625'
	},
	citycouncil: {
		'default': '0',
		'1': '52',
		'2': '53',
		'3': '54',
		'4': '55',
		'5': '56',
		'6': '57',
		'7': '58',
		'8': '59',
		'9': '60',
		'10': '61'
	},
	police: {
		//'default': '0',
		'default': '568',
		'1': '544',
		'2': '545',
		'3': '546',
		'4': '547',
		'5': '548',
		'6': '549',
		'7': '550',
		'8': '551',
		'9': '552',
		'10': '553',
		'12': '555',
		'14': '561',
		'15': '560',
		'16': '556',
		'17': '554',
		'18': '557',
		'19': '558',
		'22': '559',
		'24': '564',
		'25': '565',
		'26': '566',
		'35': '562',
		'39': '563'
	},
	phillyrising: {
		'default': '0',
		'Market East': '583',
		'Haddington': '584',
		'Hartranft': '585',
		'Frankford': '586',
		'Strawberry Mansion': '587',
		'Kensington': '588',
		'Swampoodle': '589',
		'Point Breeze': '590',
		'Brewerytown': '591',
		'Greenwich Lovely': '592',
		'Greys Ferry': '593',
		'Springfield': '594',
		'Cobbs Creek': '595',
		'Mantua': '596',
		'Elmwood': '597',
		'East Tioga': '598',
		'Summerdale': '599',
		'Lawncrest': '600',
		'Ogontz': '601',
		'East Germantown': '602',
		'Fairhill': '603',
		'North Central': '604'
	}
};