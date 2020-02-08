Component({
    data: {
        iconList: [{
          icon: 'medal',
          color: 'red',
          badge: 0,
          name: '口红'
        }, {
          icon: 'favorfill',
          color: 'orange',
          badge: 0,
          name: '面霜'
        }, {
          icon: 'camerafill',
          color: 'yellow',
          badge: 0,
          name: '眉笔'
        },{
          icon: 'likefill',
          color: 'mauve',
          badge: 0,
          name: '眼影'
        }, {
            icon: 'infofill',
          color: 'olive',
          badge: 0,
          name: '洗面奶'
        }, {
          icon: 'recharge',
          color: 'cyan',
          badge: 0,
          name: '护肤品'
        }, {
          icon: 'samefill',
          color: 'blue',
          badge: 0,
          name: '洗发水'
        }, {
          icon: 'pulldown',
          color: 'purple',
          badge: 0,
          name: '其他'
        }],
        gridCol:4,
        skin: false
      },
      methods:{
        GoSearch:function(e){
          console.log(e);
          var that = this;
          var index = e.currentTarget.dataset.idx
          var truIndex = 1  //真正要传过去的type编号
          console.log(index);
          switch(that.data.iconList[index].name){
            case "口红":truIndex = 1;break;
            case "面霜":truIndex = 2;break;
            case "眉笔":truIndex = 3;break;
            case "眼影":truIndex = 4;break;
            case "洗面奶": truIndex = 5; break;
            case "护肤品": truIndex = 6; break;
            case "洗发水": truIndex = 7; break;
            case "其他": truIndex = 8; break;
            default:truIndex = 1;break;
          }
          wx.navigateTo({
            url: "/pages/goods-list/goods-list?type=" + truIndex + "&page=" + 0 
          });
        }
      }
})