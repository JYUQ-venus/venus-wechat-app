let extConfig = wx.getExtConfigSync? wx.getExtConfigSync(): {}
export const requstUrl = 'https://slb.qmxsportseducation.com'

export const SELECT_TIME_DAY = [1,2,3,4,5,6,7]

export const SELECT_TIME_HOUR = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

export const SELECT_TIME_MINUTE = [0, 10, 20, 30, 40, 50]

export const SUBMIT_SEARCHLABEL = {
	'0': [0,0],
	'1': [0.01,10],
	'2': [10,50],
	'3': [50,100],
	'4': [100,300],
	'5': [300,10000]
}

export const COURSE_MASK_BG = {
	'1': 'linear-gradient(to right, #223164, #6C2D7E)',
	'2': 'linear-gradient(to right, #223766, #729498)',
	'3': 'linear-gradient(to right, #253262, #983D48)',
	'4': 'linear-gradient(to right, #213462, #956C40)',
	'5': 'linear-gradient(to right, #1F3565, #6095A5)'
}
