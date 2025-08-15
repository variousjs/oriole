import { App } from '@variousjs/various'
import actions from './actions'
import store from './store'
import Container from './container'
import Loader from './loader'
import Error from './error'

const entry: App<typeof store> = {
  store,
  Container,
  Loader,
  Error,
  actions,
}

export default entry
