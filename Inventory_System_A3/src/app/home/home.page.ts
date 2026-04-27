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

  public icons = {
    cube: cubeOutline,
    cloud: cloudDoneOutline,
    list: listOutline,
    add: addCircleOutline,
    edit: createOutline,        
    privacy: shieldCheckmarkOutline, 
    help: informationCircleOutline   
  };

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  navigateTo(path: string) {
    this.navCtrl.navigateRoot(path, { animated: true });
  }

}
