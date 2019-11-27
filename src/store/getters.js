const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // token: state => state.user.token,
  // avatar: state => state.user.avatar,
  // name: state => state.user.name
  token: state => state.sysUser.token,
  avatar: state => state.sysUser.avatar,
  name: state => state.sysUser.name,

  sys_menu_routers:state=>state.sysMenu.sys_menu_routers,
}
export default getters
