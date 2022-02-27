import { MainViewModel } from './main-view-model'

export function onNavigatingTo(args) {
  const page = args.object
  page.bindingContext = new MainViewModel()
}