var DEBUG = true;
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
	verified: 'select[name="UDFDATE84"]',
	label_verified: 'label:contains(Address Verification)',
	xcoord: 'input[name="dFormUdf$76"]',
	label_xcoord: 'label[for="dFormUdf$761"], label[for="dFormUdf$76"]',
	ycoord: 'input[name="dFormUdf$75"]',
	label_ycoord: 'label[for="dFormUdf$751"], label[for="dFormUdf$75"]',
	citycouncil: 'select[name="UDFDATE23"]',
	police: 'select[name="UDFDATE77"]',
	phillyrising: 'select[name="UDFDATE80"]'
};
var NODE_VALUES = {
	category_vacant_lot: '208',
	department_li: '51',
	department_streets: '15'
};
var TABLES = {
	verified: {
		'default': '0',
		'verified': '577',
		'override': '578',
		'down': '579'
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
		'default': '0',
		'1': '525',
		'2': '526',
		'3': '527',
		'4': '528',
		'5': '529',
		'6': '530',
		'7': '531',
		'8': '532',
		'9': '533',
		'10': '534',
		'12': '536',
		'14': '538',
		'15': '539',
		'16': '540',
		'17': '541',
		'18': '542',
		'19': '543',
		'22': '544',
		'24': '545',
		'25': '546',
		'26': '547',
		'35': '548',
		'39': '549'
	},
	phillyrising: {
		'default': '0',
		'Market East': '550',
		'Haddington': '551',
		'Hartranft': '552',
		'Frankford': '553',
		'Strawberry Mansion': '554',
		'Kensington': '555',
		'Swampoodle': '556',
		'Point Breeze': '557',
		'Brewerytown': '558',
		'Greenwich Lovely': '559',
		'Greys Ferry': '560',
		'Springfield': '561',
		'Cobbs Creek': '562',
		'Mantua': '563',
		'Elmwood': '564',
		'East Tioga': '565',
		'Summerdale': '566',
		'Lawncrest': '567',
		'Ogontz': '568',
		'East Germantown': '569',
		'Fairhill': '570',
		'North Central': '571'
	}
};