import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView, IActionArguments, QuickViewNavigator, BaseQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ManageOrdersAdaptiveCardExtensionStrings';
import { IManageOrdersAdaptiveCardExtensionProps, IManageOrdersAdaptiveCardExtensionState } from '../ManageOrdersAdaptiveCardExtension';

export interface IErrorQuickViewData {
  title: string;
  description: string;
  imageUrl: string;
}

export class ErrorQuickView extends BaseAdaptiveCardQuickView<
  IManageOrdersAdaptiveCardExtensionProps,
  IManageOrdersAdaptiveCardExtensionState,
  IErrorQuickViewData
> {
  public get data(): IErrorQuickViewData {
    return {
      title: strings.ErrorTitle,
      description: this.state.error,
      imageUrl: require('../assets/error.png')
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/ErrorQuickViewTemplate.json');
  }

  public onAction(action: IActionArguments): void {
    if (action.id == "close") {
      (<QuickViewNavigator<BaseQuickView<IManageOrdersAdaptiveCardExtensionProps,IManageOrdersAdaptiveCardExtensionState>>>this.quickViewNavigator).close();
    }
  }
}