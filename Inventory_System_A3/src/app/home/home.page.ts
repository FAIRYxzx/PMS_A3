import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonIcon, IonGrid, IonCol, IonRow, IonRippleEffect } from '@ionic/angular/standalone';
import {
  cubeOutline,
  cloudDoneOutline,
  listOutline,
  addCircleOutline,
  createOutline,
  shieldCheckmarkOutline,
  informationCircleOutline
} from 'ionicons/icons';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonContent, CommonModule, FormsModule, IonCard, IonIcon, IonGrid, IonCol, IonRow, IonRippleEffect]
})
export class HomePage implements OnInit {

  // 将导入的图标映射到 icons 对象中，供 HTML 中的 [src] 调用
  public icons = {
    cube: cubeOutline,
    cloud: cloudDoneOutline,
    list: listOutline,
    add: addCircleOutline,
    edit: createOutline,        // 对应你的 icons.edit
    privacy: shieldCheckmarkOutline, // 对应你的 icons.privacy
    help: informationCircleOutline   // 对应底部的提示图标
  };

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  navigateTo(path: string) {
    this.navCtrl.navigateRoot(path, { animated: true });
  }

}
