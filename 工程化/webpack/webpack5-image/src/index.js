/*
 * @Author: Lvhz
 * @Date: 2021-08-17 08:52:43
 * @Description: Description
 */
import pic from './images/xiaoxin.jpg'

console.log('hellllll');

const img = new Image()
img.src = pic;

const tag = document.getElementById('app')
tag.append(img)
