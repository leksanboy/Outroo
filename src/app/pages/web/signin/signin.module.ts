import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatButtonModule, MatButtonToggleModule, MatProgressSpinnerModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SigninComponent } from './signin.component';

const routes: Routes = [
	{
		path: '',
		component: SigninComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatProgressSpinnerModule,
		MatInputModule
	],
	declarations: [
		SigninComponent
	]
})
export class SigninModule { }
