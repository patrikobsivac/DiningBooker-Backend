(function () {
  'use strict';
  var t = {
      5229: function (t, o, n) {
        var e = n(5130),
          r = n(6768),
          i = n(4232);
        const a = { id: 'app' },
          d = ['onClick'],
          u = ['onClick'];
        function s(t, o, n, s, c, l) {
          return (
            (0, r.uX)(),
            (0, r.CE)('div', a, [
              o[3] || (o[3] = (0, r.Lk)('h1', null, 'Test', -1)),
              (0, r.Lk)(
                'form',
                {
                  onSubmit:
                    o[1] ||
                    (o[1] = (0, e.D$)(
                      (...t) => l.addTasks && l.addTasks(...t),
                      ['prevent']
                    )),
                },
                [
                  (0, r.bo)(
                    (0, r.Lk)(
                      'input',
                      {
                        'onUpdate:modelValue':
                          o[0] || (o[0] = (t) => (c.newTasks = t)),
                        placeholder: 'Enter a new task',
                      },
                      null,
                      512
                    ),
                    [[e.Jo, c.newTasks]]
                  ),
                  o[2] ||
                    (o[2] = (0, r.Lk)('button', { type: 'submit' }, 'Add', -1)),
                ],
                32
              ),
              (0, r.Lk)('ul', null, [
                ((0, r.uX)(!0),
                (0, r.CE)(
                  r.FK,
                  null,
                  (0, r.pI)(
                    c.tasks,
                    (t) => (
                      (0, r.uX)(),
                      (0, r.CE)('li', { key: t.id }, [
                        (0, r.Lk)(
                          'span',
                          {
                            style: (0, i.Tr)({
                              textDecoration: t.done ? 'line-through' : 'none',
                            }),
                            onClick: (o) => l.toggleTasks(t.id),
                          },
                          (0, i.v_)(t.text),
                          13,
                          d
                        ),
                        (0, r.Lk)(
                          'button',
                          { onClick: (o) => l.deleteTasks(t.id) },
                          'Delete',
                          8,
                          u
                        ),
                      ])
                    )
                  ),
                  128
                )),
              ]),
            ])
          );
        }
        n(4114), n(8992), n(4520);
        var c = n(3142),
          l = {
            data() {
              return { tasks: [], newTasks: '' };
            },
            async created() {
              this.tasks = await this.fetchTasks();
            },
            methods: {
              async fetchTasks() {
                const t = await c.A.get('http://localhost:3000/api/tasks');
                return t.data;
              },
              async addTasks() {
                if (this.newTasks.trim()) {
                  const t = await c.A.post('http://localhost:3000/api/tasks', {
                    text: this.newTasks,
                  });
                  this.tasks.push(t.data), (this.newTasks = '');
                }
              },
              async toggleTasks(t) {
                const o = await c.A.put(`http://localhost:3000/api/tasks/${t}`),
                  n = this.tasks.findIndex((o) => o.id === t);
                this.tasks[n] = o.data;
              },
              async deleteTasks(t) {
                await c.A.delete(`http://localhost:3000/api/tasks/${t}`),
                  (this.tasks = this.tasks.filter((o) => o.id !== t));
              },
            },
          },
          f = n(1241);
        const p = (0, f.A)(l, [['render', s]]);
        var h = p;
        (0, e.Ef)(h).mount('#app');
      },
    },
    o = {};
  function n(e) {
    var r = o[e];
    if (void 0 !== r) return r.exports;
    var i = (o[e] = { exports: {} });
    return t[e].call(i.exports, i, i.exports, n), i.exports;
  }
  (n.m = t),
    (function () {
      var t = [];
      n.O = function (o, e, r, i) {
        if (!e) {
          var a = 1 / 0;
          for (c = 0; c < t.length; c++) {
            (e = t[c][0]), (r = t[c][1]), (i = t[c][2]);
            for (var d = !0, u = 0; u < e.length; u++)
              (!1 & i || a >= i) &&
              Object.keys(n.O).every(function (t) {
                return n.O[t](e[u]);
              })
                ? e.splice(u--, 1)
                : ((d = !1), i < a && (a = i));
            if (d) {
              t.splice(c--, 1);
              var s = r();
              void 0 !== s && (o = s);
            }
          }
          return o;
        }
        i = i || 0;
        for (var c = t.length; c > 0 && t[c - 1][2] > i; c--) t[c] = t[c - 1];
        t[c] = [e, r, i];
      };
    })(),
    (function () {
      n.n = function (t) {
        var o =
          t && t.__esModule
            ? function () {
                return t['default'];
              }
            : function () {
                return t;
              };
        return n.d(o, { a: o }), o;
      };
    })(),
    (function () {
      n.d = function (t, o) {
        for (var e in o)
          n.o(o, e) &&
            !n.o(t, e) &&
            Object.defineProperty(t, e, { enumerable: !0, get: o[e] });
      };
    })(),
    (function () {
      n.g = (function () {
        if ('object' === typeof globalThis) return globalThis;
        try {
          return this || new Function('return this')();
        } catch (t) {
          if ('object' === typeof window) return window;
        }
      })();
    })(),
    (function () {
      n.o = function (t, o) {
        return Object.prototype.hasOwnProperty.call(t, o);
      };
    })(),
    (function () {
      n.r = function (t) {
        'undefined' !== typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(t, '__esModule', { value: !0 });
      };
    })(),
    (function () {
      var t = { 524: 0 };
      n.O.j = function (o) {
        return 0 === t[o];
      };
      var o = function (o, e) {
          var r,
            i,
            a = e[0],
            d = e[1],
            u = e[2],
            s = 0;
          if (
            a.some(function (o) {
              return 0 !== t[o];
            })
          ) {
            for (r in d) n.o(d, r) && (n.m[r] = d[r]);
            if (u) var c = u(n);
          }
          for (o && o(e); s < a.length; s++)
            (i = a[s]), n.o(t, i) && t[i] && t[i][0](), (t[i] = 0);
          return n.O(c);
        },
        e = (self['webpackChunkfront'] = self['webpackChunkfront'] || []);
      e.forEach(o.bind(null, 0)), (e.push = o.bind(null, e.push.bind(e)));
    })();
  var e = n.O(void 0, [504], function () {
    return n(5229);
  });
  e = n.O(e);
})();
