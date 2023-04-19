
 export    const paperOptions=[
          { name: 'ticket_size', comment: '4*6cm单排', value: 1, sort: 0, selected: 0 },
          { name: 'ticket_size', comment: '>4*6cm单排', value: 2, sort: 1, selected: 0 },
          { name: 'ticket_size', comment: '4*6cm双排', value: 3, sort: 2, selected: 0 },
          { name: 'ticket_size', comment: '>4*6cm双排', value: 4, sort: 3, selected: 0 }
        ]
export const demo = {
          batch_no: '456',
          bed_no: '123',
          style_no: 'K00088',
          bill_no: 'K00088-1',
          ticket_no: 'CJ002-1',
          color: '白色',
          size: 'M',
          num: '20',
          ticket_num: '100',
          cut_num: '500',
          package_no: '8',
          create_date: '2022-01-02',
          serial_number: '1-20',
          qr_code:
            'http://jack-mes-img.uchat.com.cn/upload/image/1/ticket/CJ00720/84f0db3b7fa7095f332faaaaedfee547.png',
          remark: '前片',
          style_name: '样名',
          customer_id: '样号',
          cuted_time: '2023-2-23'
        }

        export const defaultConfig = [
          {
            selected: false,
            name: 'customer_id',
            value: '样号',
            label: '客号：',
            realName: '客号',
            size: 16,
            x: 0,
            y: 1 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'style_no',
            label: '款号：',
            value: 'K00088',
            realName: '款号',
            size: 16,
            x: 0 * 24,
            y: 0,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'style_name',
            value: '样款',
            label: '款名：',
            realName: '款名',
            size: 16,
            x: 0 * 24,
            y: 0,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'bill_no',
            label: '单号：',
            size: 16,
            realName: '单号',
            value: 'K00088-1',
            x: 0,
            y: 1 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'batch_no',
            label: '缸号：',
            value: '456',
            realName: '缸号',
            size: 16,
            x: 0 * 24,
            y: 0,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'bed_no',
            label: '床号：',
            value: 'K00088',
            realName: '床号',
            size: 16,
            x: 0 * 24,
            y: 0,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'package_no',
            value: '8',
            label: '扎号：',
            size: 16,
            realName: '扎号',
            x: 0,
            y: 8 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'serial_number',
            value: '1-9',
            label: '流水号：',
            size: 16,
            realName: '流水号',
            x: 0,
            y: 8 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'ticket_no',
            label: '工票：',
            realName: '工票',
            value: 'CJ002-1',
            size: 16,
            x: 0,
            y: 2 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'color',
            label: '颜色：',
            realName: '颜色',
            value: '白色',
            size: 16,
            x: 0,
            y: 3 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'size',
            label: '尺码：',
            realName: '尺码',
            value: 'M',
            size: 16,
            x: 0,
            y: 4 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'num',
            label: '件数：',
            realName: '件数',
            value: '20件',
            size: 16,
            x: 0,
            y: 5 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'cut_num',
            value: '500件',
            label: '总裁数：',
            realName: '总裁数',
            size: 16,
            x: 0,
            y: 7 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'ticket_num',
            value: '100扎',
            label: '总扎数：',
            realName: '总扎数',
            size: 16,
            x: 0,
            y: 6 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'create_date',
            value: '2022-01-02',
            label: '时间：',
            realName: '时间',
            size: 16,
            x: 0,
            y: 9 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'qr_code',
            label: '二维码：',
            realName: '二维码',
            value:
              'http://jack-mes-img.uchat.com.cn/upload/image/1/ticket/CJ00720/84f0db3b7fa7095f332faaaaedfee547.png',
            tip: 'qr_code',
            size: 140,
            x: 0,
            y: 0,
            w: 0,
            h: 0
          },
          {
            selected: false,
            name: 'cuted_time',
            value: '2023-2-23',
            label: '裁剪时间：',
            realName: '裁剪时间',
            size: 16,
            x: 0,
            y: 6 * 24,
            w: 172,
            h: 24
          },
          {
            selected: false,
            name: 'customer_remark',
            value: '前片',
            label: '备注：',
            realName: '备注',
            size: 16,
            x: 0,
            y: 1 * 24,
            w: 172,
            h: 0
          }
        ]