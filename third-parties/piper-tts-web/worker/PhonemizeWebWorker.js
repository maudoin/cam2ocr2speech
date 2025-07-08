var Ct = Object.defineProperty;
var ha = (y) => {
  throw TypeError(y);
};
var xt = (y, v, S) => v in y ? Ct(y, v, { enumerable: !0, configurable: !0, writable: !0, value: S }) : y[v] = S;
var Ot = (y, v) => () => (v || y((v = { exports: {} }).exports, v), v.exports);
var I = (y, v, S) => xt(y, typeof v != "symbol" ? v + "" : v, S), _a = (y, v, S) => v.has(y) || ha("Cannot " + S);
var x = (y, v, S) => (_a(y, v, "read from private field"), S ? S.call(y) : v.get(y)), G = (y, v, S) => v.has(y) ? ha("Cannot add the same private member more than once") : v instanceof WeakSet ? v.add(y) : v.set(y, S), B = (y, v, S, O) => (_a(y, v, "write to private field"), O ? O.call(y, S) : v.set(y, S), S);
var It = Ot(($e, W) => {
  var Re = {}, Lt = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    default: Re
  }), W = { exports: {} }, $e = W.exports, We = (() => {
    var v;
    var y = typeof document < "u" ? (v = document.currentScript) == null ? void 0 : v.src : void 0;
    return typeof __filename < "u" && (y = y || __filename), function(S = {}) {
      var O, l = S, q, te, ze = new Promise((e, a) => {
        q = e, te = a;
      }), wa = typeof window == "object", ue = typeof WorkerGlobalScope < "u", ke = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string" && process.type != "renderer";
      l.expectedDataFileDownloads ?? (l.expectedDataFileDownloads = 0), l.expectedDataFileDownloads++, (() => {
        var e = typeof ENVIRONMENT_IS_PTHREAD < "u" && ENVIRONMENT_IS_PTHREAD, a = typeof ENVIRONMENT_IS_WASM_WORKER < "u" && ENVIRONMENT_IS_WASM_WORKER;
        if (e || a) return;
        var t = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
        function r(s) {
          typeof window == "object" ? window.encodeURIComponent(window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")) + "/") : typeof process > "u" && typeof location < "u" && encodeURIComponent(location.pathname.substring(0, location.pathname.lastIndexOf("/")) + "/");
          var i = "piper_phonemize.data", o = "piper_phonemize.data", d = l.locateFile ? l.locateFile(o, "") : o, m = s.remote_package_size;
          function p(f, b, z, N) {
            if (t) {
              Re.readFile(f, (E, C) => {
                E ? N(E) : z(C.buffer);
              });
              return;
            }
            l.dataFileDownloads ?? (l.dataFileDownloads = {}), fetch(f).catch((E) => Promise.reject(new Error(`Network Error: ${f}`, { cause: E }))).then((E) => {
              var va;
              if (!E.ok)
                return Promise.reject(new Error(`${E.status}: ${E.url}`));
              if (!E.body && E.arrayBuffer)
                return E.arrayBuffer().then(z);
              const C = E.body.getReader(), T = () => C.read().then(Tt).catch((De) => Promise.reject(new Error(`Unexpected error while handling : ${E.url} ${De}`, { cause: De }))), D = [], U = E.headers, R = Number(U.get("Content-Length") ?? b);
              let ga = 0;
              const Tt = ({ done: De, value: ua }) => {
                var ka;
                if (De) {
                  const ge = new Uint8Array(D.map((H) => H.length).reduce((H, jt) => H + jt, 0));
                  let ve = 0;
                  for (const H of D)
                    ge.set(H, ve), ve += H.length;
                  z(ge.buffer);
                } else {
                  D.push(ua), ga += ua.length, l.dataFileDownloads[f] = { loaded: ga, total: R };
                  let ge = 0, ve = 0;
                  for (const H of Object.values(l.dataFileDownloads))
                    ge += H.loaded, ve += H.total;
                  return (ka = l.setStatus) == null || ka.call(l, `Downloading data... (${ge}/${ve})`), T();
                }
              };
              return (va = l.setStatus) == null || va.call(l, "Downloading data..."), T();
            });
          }
          function w(f) {
            console.error("package error:", f);
          }
          var k = null, _ = l.getPreloadedPackage ? l.getPreloadedPackage(d, m) : null;
          _ || p(d, m, (f) => {
            k ? (k(f), k = null) : _ = f;
          }, w);
          function c(f) {
            function b(T, D) {
              if (!T) throw D + new Error().stack;
            }
            f.FS_createPath("/", "espeak-ng-data", !0, !0), f.FS_createPath("/espeak-ng-data", "lang", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "aav", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "art", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "azc", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "bat", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "bnt", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "ccs", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "cel", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "cus", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "dra", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "esx", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "gmq", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "gmw", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "grk", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "inc", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "ine", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "ira", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "iro", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "itc", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "jpx", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "map", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "miz", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "myn", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "poz", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "roa", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "sai", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "sem", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "sit", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "tai", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "trk", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "urj", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "zle", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "zls", !0, !0), f.FS_createPath("/espeak-ng-data/lang", "zlw", !0, !0), f.FS_createPath("/espeak-ng-data", "mbrola_ph", !0, !0), f.FS_createPath("/espeak-ng-data", "voices", !0, !0), f.FS_createPath("/espeak-ng-data/voices", "!v", !0, !0), f.FS_createPath("/espeak-ng-data/voices", "mb", !0, !0);
            function z(T, D, U) {
              this.start = T, this.end = D, this.audio = U;
            }
            z.prototype = { requests: {}, open: function(T, D) {
              this.name = D, this.requests[D] = this, f.addRunDependency(`fp ${this.name}`);
            }, send: function() {
            }, onload: function() {
              var T = this.byteArray.subarray(this.start, this.end);
              this.finish(T);
            }, finish: function(T) {
              var D = this;
              f.FS_createDataFile(this.name, null, T, !0, !0, !0), f.removeRunDependency(`fp ${D.name}`), this.requests[this.name] = null;
            } };
            for (var N = s.files, E = 0; E < N.length; ++E)
              new z(N[E].start, N[E].end, N[E].audio || 0).open("GET", N[E].filename);
            function C(T) {
              b(T, "Loading data file failed."), b(T.constructor.name === ArrayBuffer.name, "bad input to processPackageData");
              var D = new Uint8Array(T);
              z.prototype.byteArray = D;
              for (var U = s.files, R = 0; R < U.length; ++R)
                z.prototype.requests[U[R].filename].onload();
              f.removeRunDependency("datafile_piper_phonemize.data");
            }
            f.addRunDependency("datafile_piper_phonemize.data"), f.preloadResults ?? (f.preloadResults = {}), f.preloadResults[i] = { fromCache: !1 }, _ ? (C(_), _ = null) : k = C;
          }
          l.calledRun ? c(l) : (l.preRun ?? (l.preRun = [])).push(c);
        }
        r({ files: [{ filename: "/espeak-ng-data/af_dict", start: 0, end: 121473 }, { filename: "/espeak-ng-data/am_dict", start: 121473, end: 185351 }, { filename: "/espeak-ng-data/an_dict", start: 185351, end: 192042 }, { filename: "/espeak-ng-data/ar_dict", start: 192042, end: 670207 }, { filename: "/espeak-ng-data/as_dict", start: 670207, end: 675212 }, { filename: "/espeak-ng-data/az_dict", start: 675212, end: 718985 }, { filename: "/espeak-ng-data/ba_dict", start: 718985, end: 721083 }, { filename: "/espeak-ng-data/be_dict", start: 721083, end: 723735 }, { filename: "/espeak-ng-data/bg_dict", start: 723735, end: 810786 }, { filename: "/espeak-ng-data/bn_dict", start: 810786, end: 900765 }, { filename: "/espeak-ng-data/bpy_dict", start: 900765, end: 905991 }, { filename: "/espeak-ng-data/bs_dict", start: 905991, end: 953059 }, { filename: "/espeak-ng-data/ca_dict", start: 953059, end: 998625 }, { filename: "/espeak-ng-data/chr_dict", start: 998625, end: 1001484 }, { filename: "/espeak-ng-data/cmn_dict", start: 1001484, end: 2567819 }, { filename: "/espeak-ng-data/cs_dict", start: 2567819, end: 2617464 }, { filename: "/espeak-ng-data/cv_dict", start: 2617464, end: 2618808 }, { filename: "/espeak-ng-data/cy_dict", start: 2618808, end: 2661938 }, { filename: "/espeak-ng-data/da_dict", start: 2661938, end: 2907225 }, { filename: "/espeak-ng-data/de_dict", start: 2907225, end: 2975501 }, { filename: "/espeak-ng-data/el_dict", start: 2975501, end: 3048342 }, { filename: "/espeak-ng-data/en_dict", start: 3048342, end: 3215286 }, { filename: "/espeak-ng-data/eo_dict", start: 3215286, end: 3219952 }, { filename: "/espeak-ng-data/es_dict", start: 3219952, end: 3269204 }, { filename: "/espeak-ng-data/et_dict", start: 3269204, end: 3313467 }, { filename: "/espeak-ng-data/eu_dict", start: 3313467, end: 3362308 }, { filename: "/espeak-ng-data/fa_dict", start: 3362308, end: 3655543 }, { filename: "/espeak-ng-data/fi_dict", start: 3655543, end: 3699471 }, { filename: "/espeak-ng-data/fr_dict", start: 3699471, end: 3763198 }, { filename: "/espeak-ng-data/ga_dict", start: 3763198, end: 3815871 }, { filename: "/espeak-ng-data/gd_dict", start: 3815871, end: 3864992 }, { filename: "/espeak-ng-data/gn_dict", start: 3864992, end: 3868240 }, { filename: "/espeak-ng-data/grc_dict", start: 3868240, end: 3871673 }, { filename: "/espeak-ng-data/gu_dict", start: 3871673, end: 3954153 }, { filename: "/espeak-ng-data/hak_dict", start: 3954153, end: 3957488 }, { filename: "/espeak-ng-data/haw_dict", start: 3957488, end: 3959931 }, { filename: "/espeak-ng-data/he_dict", start: 3959931, end: 3966894 }, { filename: "/espeak-ng-data/hi_dict", start: 3966894, end: 4059037 }, { filename: "/espeak-ng-data/hr_dict", start: 4059037, end: 4108425 }, { filename: "/espeak-ng-data/ht_dict", start: 4108425, end: 4110228 }, { filename: "/espeak-ng-data/hu_dict", start: 4110228, end: 4264013 }, { filename: "/espeak-ng-data/hy_dict", start: 4264013, end: 4326276 }, { filename: "/espeak-ng-data/ia_dict", start: 4326276, end: 4657551 }, { filename: "/espeak-ng-data/id_dict", start: 4657551, end: 4701009 }, { filename: "/espeak-ng-data/intonations", start: 4701009, end: 4703049 }, { filename: "/espeak-ng-data/io_dict", start: 4703049, end: 4705214 }, { filename: "/espeak-ng-data/is_dict", start: 4705214, end: 4749568 }, { filename: "/espeak-ng-data/it_dict", start: 4749568, end: 4902457 }, { filename: "/espeak-ng-data/ja_dict", start: 4902457, end: 4950109 }, { filename: "/espeak-ng-data/jbo_dict", start: 4950109, end: 4952352 }, { filename: "/espeak-ng-data/ka_dict", start: 4952352, end: 5040127 }, { filename: "/espeak-ng-data/kk_dict", start: 5040127, end: 5041986 }, { filename: "/espeak-ng-data/kl_dict", start: 5041986, end: 5044824 }, { filename: "/espeak-ng-data/kn_dict", start: 5044824, end: 5132652 }, { filename: "/espeak-ng-data/ko_dict", start: 5132652, end: 5180175 }, { filename: "/espeak-ng-data/kok_dict", start: 5180175, end: 5186569 }, { filename: "/espeak-ng-data/ku_dict", start: 5186569, end: 5188834 }, { filename: "/espeak-ng-data/ky_dict", start: 5188834, end: 5253811 }, { filename: "/espeak-ng-data/la_dict", start: 5253811, end: 5257617 }, { filename: "/espeak-ng-data/lang/aav/vi", start: 5257617, end: 5257728 }, { filename: "/espeak-ng-data/lang/aav/vi-VN-x-central", start: 5257728, end: 5257871 }, { filename: "/espeak-ng-data/lang/aav/vi-VN-x-south", start: 5257871, end: 5258013 }, { filename: "/espeak-ng-data/lang/art/eo", start: 5258013, end: 5258054 }, { filename: "/espeak-ng-data/lang/art/ia", start: 5258054, end: 5258083 }, { filename: "/espeak-ng-data/lang/art/io", start: 5258083, end: 5258133 }, { filename: "/espeak-ng-data/lang/art/jbo", start: 5258133, end: 5258202 }, { filename: "/espeak-ng-data/lang/art/lfn", start: 5258202, end: 5258337 }, { filename: "/espeak-ng-data/lang/art/piqd", start: 5258337, end: 5258393 }, { filename: "/espeak-ng-data/lang/art/py", start: 5258393, end: 5258533 }, { filename: "/espeak-ng-data/lang/art/qdb", start: 5258533, end: 5258590 }, { filename: "/espeak-ng-data/lang/art/qya", start: 5258590, end: 5258763 }, { filename: "/espeak-ng-data/lang/art/sjn", start: 5258763, end: 5258938 }, { filename: "/espeak-ng-data/lang/azc/nci", start: 5258938, end: 5259052 }, { filename: "/espeak-ng-data/lang/bat/lt", start: 5259052, end: 5259080 }, { filename: "/espeak-ng-data/lang/bat/ltg", start: 5259080, end: 5259392 }, { filename: "/espeak-ng-data/lang/bat/lv", start: 5259392, end: 5259621 }, { filename: "/espeak-ng-data/lang/bnt/sw", start: 5259621, end: 5259662 }, { filename: "/espeak-ng-data/lang/bnt/tn", start: 5259662, end: 5259704 }, { filename: "/espeak-ng-data/lang/ccs/ka", start: 5259704, end: 5259828 }, { filename: "/espeak-ng-data/lang/cel/cy", start: 5259828, end: 5259865 }, { filename: "/espeak-ng-data/lang/cel/ga", start: 5259865, end: 5259931 }, { filename: "/espeak-ng-data/lang/cel/gd", start: 5259931, end: 5259982 }, { filename: "/espeak-ng-data/lang/cus/om", start: 5259982, end: 5260021 }, { filename: "/espeak-ng-data/lang/dra/kn", start: 5260021, end: 5260076 }, { filename: "/espeak-ng-data/lang/dra/ml", start: 5260076, end: 5260133 }, { filename: "/espeak-ng-data/lang/dra/ta", start: 5260133, end: 5260184 }, { filename: "/espeak-ng-data/lang/dra/te", start: 5260184, end: 5260254 }, { filename: "/espeak-ng-data/lang/esx/kl", start: 5260254, end: 5260284 }, { filename: "/espeak-ng-data/lang/eu", start: 5260284, end: 5260338 }, { filename: "/espeak-ng-data/lang/gmq/da", start: 5260338, end: 5260381 }, { filename: "/espeak-ng-data/lang/gmq/is", start: 5260381, end: 5260408 }, { filename: "/espeak-ng-data/lang/gmq/nb", start: 5260408, end: 5260495 }, { filename: "/espeak-ng-data/lang/gmq/sv", start: 5260495, end: 5260520 }, { filename: "/espeak-ng-data/lang/gmw/af", start: 5260520, end: 5260643 }, { filename: "/espeak-ng-data/lang/gmw/de", start: 5260643, end: 5260685 }, { filename: "/espeak-ng-data/lang/gmw/en", start: 5260685, end: 5260825 }, { filename: "/espeak-ng-data/lang/gmw/en-029", start: 5260825, end: 5261160 }, { filename: "/espeak-ng-data/lang/gmw/en-GB-scotland", start: 5261160, end: 5261455 }, { filename: "/espeak-ng-data/lang/gmw/en-GB-x-gbclan", start: 5261455, end: 5261693 }, { filename: "/espeak-ng-data/lang/gmw/en-GB-x-gbcwmd", start: 5261693, end: 5261881 }, { filename: "/espeak-ng-data/lang/gmw/en-GB-x-rp", start: 5261881, end: 5262130 }, { filename: "/espeak-ng-data/lang/gmw/en-US", start: 5262130, end: 5262387 }, { filename: "/espeak-ng-data/lang/gmw/en-US-nyc", start: 5262387, end: 5262658 }, { filename: "/espeak-ng-data/lang/gmw/lb", start: 5262658, end: 5262689 }, { filename: "/espeak-ng-data/lang/gmw/nl", start: 5262689, end: 5262712 }, { filename: "/espeak-ng-data/lang/grk/el", start: 5262712, end: 5262735 }, { filename: "/espeak-ng-data/lang/grk/grc", start: 5262735, end: 5262834 }, { filename: "/espeak-ng-data/lang/inc/as", start: 5262834, end: 5262876 }, { filename: "/espeak-ng-data/lang/inc/bn", start: 5262876, end: 5262901 }, { filename: "/espeak-ng-data/lang/inc/bpy", start: 5262901, end: 5262940 }, { filename: "/espeak-ng-data/lang/inc/gu", start: 5262940, end: 5262982 }, { filename: "/espeak-ng-data/lang/inc/hi", start: 5262982, end: 5263005 }, { filename: "/espeak-ng-data/lang/inc/kok", start: 5263005, end: 5263031 }, { filename: "/espeak-ng-data/lang/inc/mr", start: 5263031, end: 5263072 }, { filename: "/espeak-ng-data/lang/inc/ne", start: 5263072, end: 5263109 }, { filename: "/espeak-ng-data/lang/inc/or", start: 5263109, end: 5263148 }, { filename: "/espeak-ng-data/lang/inc/pa", start: 5263148, end: 5263173 }, { filename: "/espeak-ng-data/lang/inc/sd", start: 5263173, end: 5263239 }, { filename: "/espeak-ng-data/lang/inc/si", start: 5263239, end: 5263294 }, { filename: "/espeak-ng-data/lang/inc/ur", start: 5263294, end: 5263388 }, { filename: "/espeak-ng-data/lang/ine/hy", start: 5263388, end: 5263449 }, { filename: "/espeak-ng-data/lang/ine/hyw", start: 5263449, end: 5263814 }, { filename: "/espeak-ng-data/lang/ine/sq", start: 5263814, end: 5263917 }, { filename: "/espeak-ng-data/lang/ira/fa", start: 5263917, end: 5264007 }, { filename: "/espeak-ng-data/lang/ira/fa-Latn", start: 5264007, end: 5264276 }, { filename: "/espeak-ng-data/lang/ira/ku", start: 5264276, end: 5264316 }, { filename: "/espeak-ng-data/lang/iro/chr", start: 5264316, end: 5264885 }, { filename: "/espeak-ng-data/lang/itc/la", start: 5264885, end: 5265182 }, { filename: "/espeak-ng-data/lang/jpx/ja", start: 5265182, end: 5265234 }, { filename: "/espeak-ng-data/lang/ko", start: 5265234, end: 5265285 }, { filename: "/espeak-ng-data/lang/map/haw", start: 5265285, end: 5265327 }, { filename: "/espeak-ng-data/lang/miz/mto", start: 5265327, end: 5265510 }, { filename: "/espeak-ng-data/lang/myn/quc", start: 5265510, end: 5265720 }, { filename: "/espeak-ng-data/lang/poz/id", start: 5265720, end: 5265854 }, { filename: "/espeak-ng-data/lang/poz/mi", start: 5265854, end: 5266221 }, { filename: "/espeak-ng-data/lang/poz/ms", start: 5266221, end: 5266651 }, { filename: "/espeak-ng-data/lang/qu", start: 5266651, end: 5266739 }, { filename: "/espeak-ng-data/lang/roa/an", start: 5266739, end: 5266766 }, { filename: "/espeak-ng-data/lang/roa/ca", start: 5266766, end: 5266791 }, { filename: "/espeak-ng-data/lang/roa/es", start: 5266791, end: 5266854 }, { filename: "/espeak-ng-data/lang/roa/es-419", start: 5266854, end: 5267021 }, { filename: "/espeak-ng-data/lang/roa/fr", start: 5267021, end: 5267100 }, { filename: "/espeak-ng-data/lang/roa/fr-BE", start: 5267100, end: 5267184 }, { filename: "/espeak-ng-data/lang/roa/fr-CH", start: 5267184, end: 5267270 }, { filename: "/espeak-ng-data/lang/roa/ht", start: 5267270, end: 5267410 }, { filename: "/espeak-ng-data/lang/roa/it", start: 5267410, end: 5267519 }, { filename: "/espeak-ng-data/lang/roa/pap", start: 5267519, end: 5267581 }, { filename: "/espeak-ng-data/lang/roa/pt", start: 5267581, end: 5267676 }, { filename: "/espeak-ng-data/lang/roa/pt-BR", start: 5267676, end: 5267785 }, { filename: "/espeak-ng-data/lang/roa/ro", start: 5267785, end: 5267811 }, { filename: "/espeak-ng-data/lang/sai/gn", start: 5267811, end: 5267858 }, { filename: "/espeak-ng-data/lang/sem/am", start: 5267858, end: 5267899 }, { filename: "/espeak-ng-data/lang/sem/ar", start: 5267899, end: 5267949 }, { filename: "/espeak-ng-data/lang/sem/he", start: 5267949, end: 5267989 }, { filename: "/espeak-ng-data/lang/sem/mt", start: 5267989, end: 5268030 }, { filename: "/espeak-ng-data/lang/sit/cmn", start: 5268030, end: 5268716 }, { filename: "/espeak-ng-data/lang/sit/cmn-Latn-pinyin", start: 5268716, end: 5268877 }, { filename: "/espeak-ng-data/lang/sit/hak", start: 5268877, end: 5269005 }, { filename: "/espeak-ng-data/lang/sit/my", start: 5269005, end: 5269061 }, { filename: "/espeak-ng-data/lang/sit/yue", start: 5269061, end: 5269255 }, { filename: "/espeak-ng-data/lang/sit/yue-Latn-jyutping", start: 5269255, end: 5269468 }, { filename: "/espeak-ng-data/lang/tai/shn", start: 5269468, end: 5269560 }, { filename: "/espeak-ng-data/lang/tai/th", start: 5269560, end: 5269597 }, { filename: "/espeak-ng-data/lang/trk/az", start: 5269597, end: 5269642 }, { filename: "/espeak-ng-data/lang/trk/ba", start: 5269642, end: 5269667 }, { filename: "/espeak-ng-data/lang/trk/cv", start: 5269667, end: 5269707 }, { filename: "/espeak-ng-data/lang/trk/kk", start: 5269707, end: 5269747 }, { filename: "/espeak-ng-data/lang/trk/ky", start: 5269747, end: 5269790 }, { filename: "/espeak-ng-data/lang/trk/nog", start: 5269790, end: 5269829 }, { filename: "/espeak-ng-data/lang/trk/tk", start: 5269829, end: 5269854 }, { filename: "/espeak-ng-data/lang/trk/tr", start: 5269854, end: 5269879 }, { filename: "/espeak-ng-data/lang/trk/tt", start: 5269879, end: 5269902 }, { filename: "/espeak-ng-data/lang/trk/ug", start: 5269902, end: 5269926 }, { filename: "/espeak-ng-data/lang/trk/uz", start: 5269926, end: 5269965 }, { filename: "/espeak-ng-data/lang/urj/et", start: 5269965, end: 5270202 }, { filename: "/espeak-ng-data/lang/urj/fi", start: 5270202, end: 5270439 }, { filename: "/espeak-ng-data/lang/urj/hu", start: 5270439, end: 5270512 }, { filename: "/espeak-ng-data/lang/urj/smj", start: 5270512, end: 5270557 }, { filename: "/espeak-ng-data/lang/zle/be", start: 5270557, end: 5270609 }, { filename: "/espeak-ng-data/lang/zle/ru", start: 5270609, end: 5270666 }, { filename: "/espeak-ng-data/lang/zle/ru-LV", start: 5270666, end: 5270946 }, { filename: "/espeak-ng-data/lang/zle/ru-cl", start: 5270946, end: 5271037 }, { filename: "/espeak-ng-data/lang/zle/uk", start: 5271037, end: 5271134 }, { filename: "/espeak-ng-data/lang/zls/bg", start: 5271134, end: 5271245 }, { filename: "/espeak-ng-data/lang/zls/bs", start: 5271245, end: 5271475 }, { filename: "/espeak-ng-data/lang/zls/hr", start: 5271475, end: 5271737 }, { filename: "/espeak-ng-data/lang/zls/mk", start: 5271737, end: 5271765 }, { filename: "/espeak-ng-data/lang/zls/sl", start: 5271765, end: 5271808 }, { filename: "/espeak-ng-data/lang/zls/sr", start: 5271808, end: 5272058 }, { filename: "/espeak-ng-data/lang/zlw/cs", start: 5272058, end: 5272081 }, { filename: "/espeak-ng-data/lang/zlw/pl", start: 5272081, end: 5272119 }, { filename: "/espeak-ng-data/lang/zlw/sk", start: 5272119, end: 5272143 }, { filename: "/espeak-ng-data/lb_dict", start: 5272143, end: 5960074 }, { filename: "/espeak-ng-data/lfn_dict", start: 5960074, end: 5962867 }, { filename: "/espeak-ng-data/lt_dict", start: 5962867, end: 6012757 }, { filename: "/espeak-ng-data/lv_dict", start: 6012757, end: 6079094 }, { filename: "/espeak-ng-data/mbrola_ph/af1_phtrans", start: 6079094, end: 6080730 }, { filename: "/espeak-ng-data/mbrola_ph/ar1_phtrans", start: 6080730, end: 6082342 }, { filename: "/espeak-ng-data/mbrola_ph/ar2_phtrans", start: 6082342, end: 6083954 }, { filename: "/espeak-ng-data/mbrola_ph/ca_phtrans", start: 6083954, end: 6085950 }, { filename: "/espeak-ng-data/mbrola_ph/cmn_phtrans", start: 6085950, end: 6087442 }, { filename: "/espeak-ng-data/mbrola_ph/cr1_phtrans", start: 6087442, end: 6089606 }, { filename: "/espeak-ng-data/mbrola_ph/cs_phtrans", start: 6089606, end: 6090186 }, { filename: "/espeak-ng-data/mbrola_ph/de2_phtrans", start: 6090186, end: 6091918 }, { filename: "/espeak-ng-data/mbrola_ph/de4_phtrans", start: 6091918, end: 6093722 }, { filename: "/espeak-ng-data/mbrola_ph/de6_phtrans", start: 6093722, end: 6095118 }, { filename: "/espeak-ng-data/mbrola_ph/de8_phtrans", start: 6095118, end: 6096274 }, { filename: "/espeak-ng-data/mbrola_ph/ee1_phtrans", start: 6096274, end: 6097718 }, { filename: "/espeak-ng-data/mbrola_ph/en1_phtrans", start: 6097718, end: 6098514 }, { filename: "/espeak-ng-data/mbrola_ph/es3_phtrans", start: 6098514, end: 6099574 }, { filename: "/espeak-ng-data/mbrola_ph/es4_phtrans", start: 6099574, end: 6100682 }, { filename: "/espeak-ng-data/mbrola_ph/es_phtrans", start: 6100682, end: 6102414 }, { filename: "/espeak-ng-data/mbrola_ph/fr_phtrans", start: 6102414, end: 6104386 }, { filename: "/espeak-ng-data/mbrola_ph/gr1_phtrans", start: 6104386, end: 6106598 }, { filename: "/espeak-ng-data/mbrola_ph/gr2_phtrans", start: 6106598, end: 6108810 }, { filename: "/espeak-ng-data/mbrola_ph/grc-de6_phtrans", start: 6108810, end: 6109294 }, { filename: "/espeak-ng-data/mbrola_ph/he_phtrans", start: 6109294, end: 6110042 }, { filename: "/espeak-ng-data/mbrola_ph/hn1_phtrans", start: 6110042, end: 6110574 }, { filename: "/espeak-ng-data/mbrola_ph/hu1_phtrans", start: 6110574, end: 6112018 }, { filename: "/espeak-ng-data/mbrola_ph/ic1_phtrans", start: 6112018, end: 6113150 }, { filename: "/espeak-ng-data/mbrola_ph/id1_phtrans", start: 6113150, end: 6114858 }, { filename: "/espeak-ng-data/mbrola_ph/in_phtrans", start: 6114858, end: 6116302 }, { filename: "/espeak-ng-data/mbrola_ph/ir1_phtrans", start: 6116302, end: 6122114 }, { filename: "/espeak-ng-data/mbrola_ph/it1_phtrans", start: 6122114, end: 6123438 }, { filename: "/espeak-ng-data/mbrola_ph/it3_phtrans", start: 6123438, end: 6124330 }, { filename: "/espeak-ng-data/mbrola_ph/jp_phtrans", start: 6124330, end: 6125366 }, { filename: "/espeak-ng-data/mbrola_ph/la1_phtrans", start: 6125366, end: 6126114 }, { filename: "/espeak-ng-data/mbrola_ph/lt_phtrans", start: 6126114, end: 6127174 }, { filename: "/espeak-ng-data/mbrola_ph/ma1_phtrans", start: 6127174, end: 6128114 }, { filename: "/espeak-ng-data/mbrola_ph/mx1_phtrans", start: 6128114, end: 6129918 }, { filename: "/espeak-ng-data/mbrola_ph/mx2_phtrans", start: 6129918, end: 6131746 }, { filename: "/espeak-ng-data/mbrola_ph/nl_phtrans", start: 6131746, end: 6133430 }, { filename: "/espeak-ng-data/mbrola_ph/nz1_phtrans", start: 6133430, end: 6134154 }, { filename: "/espeak-ng-data/mbrola_ph/pl1_phtrans", start: 6134154, end: 6135742 }, { filename: "/espeak-ng-data/mbrola_ph/pt1_phtrans", start: 6135742, end: 6137834 }, { filename: "/espeak-ng-data/mbrola_ph/ptbr4_phtrans", start: 6137834, end: 6140190 }, { filename: "/espeak-ng-data/mbrola_ph/ptbr_phtrans", start: 6140190, end: 6142714 }, { filename: "/espeak-ng-data/mbrola_ph/ro1_phtrans", start: 6142714, end: 6144878 }, { filename: "/espeak-ng-data/mbrola_ph/sv2_phtrans", start: 6144878, end: 6146466 }, { filename: "/espeak-ng-data/mbrola_ph/sv_phtrans", start: 6146466, end: 6148054 }, { filename: "/espeak-ng-data/mbrola_ph/tl1_phtrans", start: 6148054, end: 6148826 }, { filename: "/espeak-ng-data/mbrola_ph/tr1_phtrans", start: 6148826, end: 6149190 }, { filename: "/espeak-ng-data/mbrola_ph/us3_phtrans", start: 6149190, end: 6150346 }, { filename: "/espeak-ng-data/mbrola_ph/us_phtrans", start: 6150346, end: 6151574 }, { filename: "/espeak-ng-data/mbrola_ph/vz_phtrans", start: 6151574, end: 6153858 }, { filename: "/espeak-ng-data/mi_dict", start: 6153858, end: 6155204 }, { filename: "/espeak-ng-data/mk_dict", start: 6155204, end: 6219063 }, { filename: "/espeak-ng-data/ml_dict", start: 6219063, end: 6311408 }, { filename: "/espeak-ng-data/mr_dict", start: 6311408, end: 6398799 }, { filename: "/espeak-ng-data/ms_dict", start: 6398799, end: 6452340 }, { filename: "/espeak-ng-data/mt_dict", start: 6452340, end: 6456724 }, { filename: "/espeak-ng-data/mto_dict", start: 6456724, end: 6460684 }, { filename: "/espeak-ng-data/my_dict", start: 6460684, end: 6556632 }, { filename: "/espeak-ng-data/nci_dict", start: 6556632, end: 6558166 }, { filename: "/espeak-ng-data/ne_dict", start: 6558166, end: 6653543 }, { filename: "/espeak-ng-data/nl_dict", start: 6653543, end: 6719522 }, { filename: "/espeak-ng-data/no_dict", start: 6719522, end: 6723700 }, { filename: "/espeak-ng-data/nog_dict", start: 6723700, end: 6726994 }, { filename: "/espeak-ng-data/om_dict", start: 6726994, end: 6729296 }, { filename: "/espeak-ng-data/or_dict", start: 6729296, end: 6818542 }, { filename: "/espeak-ng-data/pa_dict", start: 6818542, end: 6898495 }, { filename: "/espeak-ng-data/pap_dict", start: 6898495, end: 6900623 }, { filename: "/espeak-ng-data/phondata", start: 6900623, end: 7451047 }, { filename: "/espeak-ng-data/phondata-manifest", start: 7451047, end: 7472868 }, { filename: "/espeak-ng-data/phonindex", start: 7472868, end: 7511942 }, { filename: "/espeak-ng-data/phontab", start: 7511942, end: 7567738 }, { filename: "/espeak-ng-data/piqd_dict", start: 7567738, end: 7569448 }, { filename: "/espeak-ng-data/pl_dict", start: 7569448, end: 7646178 }, { filename: "/espeak-ng-data/pt_dict", start: 7646178, end: 7713995 }, { filename: "/espeak-ng-data/py_dict", start: 7713995, end: 7716404 }, { filename: "/espeak-ng-data/qdb_dict", start: 7716404, end: 7719432 }, { filename: "/espeak-ng-data/qu_dict", start: 7719432, end: 7721351 }, { filename: "/espeak-ng-data/quc_dict", start: 7721351, end: 7722801 }, { filename: "/espeak-ng-data/qya_dict", start: 7722801, end: 7724740 }, { filename: "/espeak-ng-data/ro_dict", start: 7724740, end: 7793278 }, { filename: "/espeak-ng-data/ru_dict", start: 7793278, end: 16325670 }, { filename: "/espeak-ng-data/sd_dict", start: 16325670, end: 16385598 }, { filename: "/espeak-ng-data/shn_dict", start: 16385598, end: 16473770 }, { filename: "/espeak-ng-data/si_dict", start: 16473770, end: 16559154 }, { filename: "/espeak-ng-data/sjn_dict", start: 16559154, end: 16560937 }, { filename: "/espeak-ng-data/sk_dict", start: 16560937, end: 16610939 }, { filename: "/espeak-ng-data/sl_dict", start: 16610939, end: 16655986 }, { filename: "/espeak-ng-data/smj_dict", start: 16655986, end: 16691081 }, { filename: "/espeak-ng-data/sq_dict", start: 16691081, end: 16736084 }, { filename: "/espeak-ng-data/sr_dict", start: 16736084, end: 16782916 }, { filename: "/espeak-ng-data/sv_dict", start: 16782916, end: 16830752 }, { filename: "/espeak-ng-data/sw_dict", start: 16830752, end: 16878556 }, { filename: "/espeak-ng-data/ta_dict", start: 16878556, end: 17088109 }, { filename: "/espeak-ng-data/te_dict", start: 17088109, end: 17182946 }, { filename: "/espeak-ng-data/th_dict", start: 17182946, end: 17185247 }, { filename: "/espeak-ng-data/tk_dict", start: 17185247, end: 17206115 }, { filename: "/espeak-ng-data/tn_dict", start: 17206115, end: 17209187 }, { filename: "/espeak-ng-data/tr_dict", start: 17209187, end: 17255980 }, { filename: "/espeak-ng-data/tt_dict", start: 17255980, end: 17258101 }, { filename: "/espeak-ng-data/ug_dict", start: 17258101, end: 17260171 }, { filename: "/espeak-ng-data/uk_dict", start: 17260171, end: 17263663 }, { filename: "/espeak-ng-data/ur_dict", start: 17263663, end: 17397219 }, { filename: "/espeak-ng-data/uz_dict", start: 17397219, end: 17399759 }, { filename: "/espeak-ng-data/vi_dict", start: 17399759, end: 17452367 }, { filename: "/espeak-ng-data/voices/!v/Alex", start: 17452367, end: 17452495 }, { filename: "/espeak-ng-data/voices/!v/Alicia", start: 17452495, end: 17452969 }, { filename: "/espeak-ng-data/voices/!v/Andrea", start: 17452969, end: 17453326 }, { filename: "/espeak-ng-data/voices/!v/Andy", start: 17453326, end: 17453646 }, { filename: "/espeak-ng-data/voices/!v/Annie", start: 17453646, end: 17453961 }, { filename: "/espeak-ng-data/voices/!v/AnxiousAndy", start: 17453961, end: 17454322 }, { filename: "/espeak-ng-data/voices/!v/Demonic", start: 17454322, end: 17458180 }, { filename: "/espeak-ng-data/voices/!v/Denis", start: 17458180, end: 17458485 }, { filename: "/espeak-ng-data/voices/!v/Diogo", start: 17458485, end: 17458864 }, { filename: "/espeak-ng-data/voices/!v/Gene", start: 17458864, end: 17459145 }, { filename: "/espeak-ng-data/voices/!v/Gene2", start: 17459145, end: 17459428 }, { filename: "/espeak-ng-data/voices/!v/Henrique", start: 17459428, end: 17459809 }, { filename: "/espeak-ng-data/voices/!v/Hugo", start: 17459809, end: 17460187 }, { filename: "/espeak-ng-data/voices/!v/Jacky", start: 17460187, end: 17460454 }, { filename: "/espeak-ng-data/voices/!v/Lee", start: 17460454, end: 17460792 }, { filename: "/espeak-ng-data/voices/!v/Marco", start: 17460792, end: 17461259 }, { filename: "/espeak-ng-data/voices/!v/Mario", start: 17461259, end: 17461529 }, { filename: "/espeak-ng-data/voices/!v/Michael", start: 17461529, end: 17461799 }, { filename: "/espeak-ng-data/voices/!v/Mike", start: 17461799, end: 17461911 }, { filename: "/espeak-ng-data/voices/!v/Mr serious", start: 17461911, end: 17465104 }, { filename: "/espeak-ng-data/voices/!v/Nguyen", start: 17465104, end: 17465384 }, { filename: "/espeak-ng-data/voices/!v/Reed", start: 17465384, end: 17465586 }, { filename: "/espeak-ng-data/voices/!v/RicishayMax", start: 17465586, end: 17465819 }, { filename: "/espeak-ng-data/voices/!v/RicishayMax2", start: 17465819, end: 17466254 }, { filename: "/espeak-ng-data/voices/!v/RicishayMax3", start: 17466254, end: 17466689 }, { filename: "/espeak-ng-data/voices/!v/Storm", start: 17466689, end: 17467109 }, { filename: "/espeak-ng-data/voices/!v/Tweaky", start: 17467109, end: 17470298 }, { filename: "/espeak-ng-data/voices/!v/UniRobot", start: 17470298, end: 17470715 }, { filename: "/espeak-ng-data/voices/!v/adam", start: 17470715, end: 17470790 }, { filename: "/espeak-ng-data/voices/!v/anika", start: 17470790, end: 17471283 }, { filename: "/espeak-ng-data/voices/!v/anikaRobot", start: 17471283, end: 17471795 }, { filename: "/espeak-ng-data/voices/!v/announcer", start: 17471795, end: 17472095 }, { filename: "/espeak-ng-data/voices/!v/antonio", start: 17472095, end: 17472476 }, { filename: "/espeak-ng-data/voices/!v/aunty", start: 17472476, end: 17472834 }, { filename: "/espeak-ng-data/voices/!v/belinda", start: 17472834, end: 17473174 }, { filename: "/espeak-ng-data/voices/!v/benjamin", start: 17473174, end: 17473375 }, { filename: "/espeak-ng-data/voices/!v/boris", start: 17473375, end: 17473599 }, { filename: "/espeak-ng-data/voices/!v/caleb", start: 17473599, end: 17473656 }, { filename: "/espeak-ng-data/voices/!v/croak", start: 17473656, end: 17473749 }, { filename: "/espeak-ng-data/voices/!v/david", start: 17473749, end: 17473861 }, { filename: "/espeak-ng-data/voices/!v/ed", start: 17473861, end: 17474148 }, { filename: "/espeak-ng-data/voices/!v/edward", start: 17474148, end: 17474299 }, { filename: "/espeak-ng-data/voices/!v/edward2", start: 17474299, end: 17474451 }, { filename: "/espeak-ng-data/voices/!v/f1", start: 17474451, end: 17474775 }, { filename: "/espeak-ng-data/voices/!v/f2", start: 17474775, end: 17475132 }, { filename: "/espeak-ng-data/voices/!v/f3", start: 17475132, end: 17475507 }, { filename: "/espeak-ng-data/voices/!v/f4", start: 17475507, end: 17475857 }, { filename: "/espeak-ng-data/voices/!v/f5", start: 17475857, end: 17476289 }, { filename: "/espeak-ng-data/voices/!v/fast", start: 17476289, end: 17476438 }, { filename: "/espeak-ng-data/voices/!v/grandma", start: 17476438, end: 17476701 }, { filename: "/espeak-ng-data/voices/!v/grandpa", start: 17476701, end: 17476957 }, { filename: "/espeak-ng-data/voices/!v/gustave", start: 17476957, end: 17477210 }, { filename: "/espeak-ng-data/voices/!v/ian", start: 17477210, end: 17480378 }, { filename: "/espeak-ng-data/voices/!v/iven", start: 17480378, end: 17480639 }, { filename: "/espeak-ng-data/voices/!v/iven2", start: 17480639, end: 17480918 }, { filename: "/espeak-ng-data/voices/!v/iven3", start: 17480918, end: 17481180 }, { filename: "/espeak-ng-data/voices/!v/iven4", start: 17481180, end: 17481441 }, { filename: "/espeak-ng-data/voices/!v/john", start: 17481441, end: 17484627 }, { filename: "/espeak-ng-data/voices/!v/kaukovalta", start: 17484627, end: 17484988 }, { filename: "/espeak-ng-data/voices/!v/klatt", start: 17484988, end: 17485026 }, { filename: "/espeak-ng-data/voices/!v/klatt2", start: 17485026, end: 17485064 }, { filename: "/espeak-ng-data/voices/!v/klatt3", start: 17485064, end: 17485103 }, { filename: "/espeak-ng-data/voices/!v/klatt4", start: 17485103, end: 17485142 }, { filename: "/espeak-ng-data/voices/!v/klatt5", start: 17485142, end: 17485181 }, { filename: "/espeak-ng-data/voices/!v/klatt6", start: 17485181, end: 17485220 }, { filename: "/espeak-ng-data/voices/!v/linda", start: 17485220, end: 17485570 }, { filename: "/espeak-ng-data/voices/!v/m1", start: 17485570, end: 17485905 }, { filename: "/espeak-ng-data/voices/!v/m2", start: 17485905, end: 17486169 }, { filename: "/espeak-ng-data/voices/!v/m3", start: 17486169, end: 17486469 }, { filename: "/espeak-ng-data/voices/!v/m4", start: 17486469, end: 17486759 }, { filename: "/espeak-ng-data/voices/!v/m5", start: 17486759, end: 17487021 }, { filename: "/espeak-ng-data/voices/!v/m6", start: 17487021, end: 17487209 }, { filename: "/espeak-ng-data/voices/!v/m7", start: 17487209, end: 17487463 }, { filename: "/espeak-ng-data/voices/!v/m8", start: 17487463, end: 17487747 }, { filename: "/espeak-ng-data/voices/!v/marcelo", start: 17487747, end: 17487998 }, { filename: "/espeak-ng-data/voices/!v/max", start: 17487998, end: 17488223 }, { filename: "/espeak-ng-data/voices/!v/michel", start: 17488223, end: 17488627 }, { filename: "/espeak-ng-data/voices/!v/miguel", start: 17488627, end: 17489009 }, { filename: "/espeak-ng-data/voices/!v/mike2", start: 17489009, end: 17489197 }, { filename: "/espeak-ng-data/voices/!v/norbert", start: 17489197, end: 17492386 }, { filename: "/espeak-ng-data/voices/!v/pablo", start: 17492386, end: 17495528 }, { filename: "/espeak-ng-data/voices/!v/paul", start: 17495528, end: 17495812 }, { filename: "/espeak-ng-data/voices/!v/pedro", start: 17495812, end: 17496164 }, { filename: "/espeak-ng-data/voices/!v/quincy", start: 17496164, end: 17496518 }, { filename: "/espeak-ng-data/voices/!v/rob", start: 17496518, end: 17496783 }, { filename: "/espeak-ng-data/voices/!v/robert", start: 17496783, end: 17497057 }, { filename: "/espeak-ng-data/voices/!v/robosoft", start: 17497057, end: 17497508 }, { filename: "/espeak-ng-data/voices/!v/robosoft2", start: 17497508, end: 17497962 }, { filename: "/espeak-ng-data/voices/!v/robosoft3", start: 17497962, end: 17498417 }, { filename: "/espeak-ng-data/voices/!v/robosoft4", start: 17498417, end: 17498864 }, { filename: "/espeak-ng-data/voices/!v/robosoft5", start: 17498864, end: 17499309 }, { filename: "/espeak-ng-data/voices/!v/robosoft6", start: 17499309, end: 17499596 }, { filename: "/espeak-ng-data/voices/!v/robosoft7", start: 17499596, end: 17500006 }, { filename: "/espeak-ng-data/voices/!v/robosoft8", start: 17500006, end: 17500249 }, { filename: "/espeak-ng-data/voices/!v/sandro", start: 17500249, end: 17500779 }, { filename: "/espeak-ng-data/voices/!v/shelby", start: 17500779, end: 17501059 }, { filename: "/espeak-ng-data/voices/!v/steph", start: 17501059, end: 17501423 }, { filename: "/espeak-ng-data/voices/!v/steph2", start: 17501423, end: 17501790 }, { filename: "/espeak-ng-data/voices/!v/steph3", start: 17501790, end: 17502167 }, { filename: "/espeak-ng-data/voices/!v/travis", start: 17502167, end: 17502550 }, { filename: "/espeak-ng-data/voices/!v/victor", start: 17502550, end: 17502803 }, { filename: "/espeak-ng-data/voices/!v/whisper", start: 17502803, end: 17502989 }, { filename: "/espeak-ng-data/voices/!v/whisperf", start: 17502989, end: 17503381 }, { filename: "/espeak-ng-data/voices/!v/zac", start: 17503381, end: 17503656 }, { filename: "/espeak-ng-data/voices/mb/mb-af1", start: 17503656, end: 17503744 }, { filename: "/espeak-ng-data/voices/mb/mb-af1-en", start: 17503744, end: 17503827 }, { filename: "/espeak-ng-data/voices/mb/mb-ar1", start: 17503827, end: 17503911 }, { filename: "/espeak-ng-data/voices/mb/mb-ar2", start: 17503911, end: 17503995 }, { filename: "/espeak-ng-data/voices/mb/mb-br1", start: 17503995, end: 17504127 }, { filename: "/espeak-ng-data/voices/mb/mb-br2", start: 17504127, end: 17504263 }, { filename: "/espeak-ng-data/voices/mb/mb-br3", start: 17504263, end: 17504395 }, { filename: "/espeak-ng-data/voices/mb/mb-br4", start: 17504395, end: 17504531 }, { filename: "/espeak-ng-data/voices/mb/mb-ca1", start: 17504531, end: 17504636 }, { filename: "/espeak-ng-data/voices/mb/mb-ca2", start: 17504636, end: 17504741 }, { filename: "/espeak-ng-data/voices/mb/mb-cn1", start: 17504741, end: 17504833 }, { filename: "/espeak-ng-data/voices/mb/mb-cr1", start: 17504833, end: 17504944 }, { filename: "/espeak-ng-data/voices/mb/mb-cz1", start: 17504944, end: 17505014 }, { filename: "/espeak-ng-data/voices/mb/mb-cz2", start: 17505014, end: 17505096 }, { filename: "/espeak-ng-data/voices/mb/mb-de1", start: 17505096, end: 17505240 }, { filename: "/espeak-ng-data/voices/mb/mb-de1-en", start: 17505240, end: 17505336 }, { filename: "/espeak-ng-data/voices/mb/mb-de2", start: 17505336, end: 17505464 }, { filename: "/espeak-ng-data/voices/mb/mb-de2-en", start: 17505464, end: 17505544 }, { filename: "/espeak-ng-data/voices/mb/mb-de3", start: 17505544, end: 17505643 }, { filename: "/espeak-ng-data/voices/mb/mb-de3-en", start: 17505643, end: 17505739 }, { filename: "/espeak-ng-data/voices/mb/mb-de4", start: 17505739, end: 17505868 }, { filename: "/espeak-ng-data/voices/mb/mb-de4-en", start: 17505868, end: 17505949 }, { filename: "/espeak-ng-data/voices/mb/mb-de5", start: 17505949, end: 17506185 }, { filename: "/espeak-ng-data/voices/mb/mb-de5-en", start: 17506185, end: 17506275 }, { filename: "/espeak-ng-data/voices/mb/mb-de6", start: 17506275, end: 17506397 }, { filename: "/espeak-ng-data/voices/mb/mb-de6-en", start: 17506397, end: 17506471 }, { filename: "/espeak-ng-data/voices/mb/mb-de6-grc", start: 17506471, end: 17506554 }, { filename: "/espeak-ng-data/voices/mb/mb-de7", start: 17506554, end: 17506704 }, { filename: "/espeak-ng-data/voices/mb/mb-de8", start: 17506704, end: 17506775 }, { filename: "/espeak-ng-data/voices/mb/mb-ee1", start: 17506775, end: 17506872 }, { filename: "/espeak-ng-data/voices/mb/mb-en1", start: 17506872, end: 17507003 }, { filename: "/espeak-ng-data/voices/mb/mb-es1", start: 17507003, end: 17507117 }, { filename: "/espeak-ng-data/voices/mb/mb-es2", start: 17507117, end: 17507225 }, { filename: "/espeak-ng-data/voices/mb/mb-es3", start: 17507225, end: 17507329 }, { filename: "/espeak-ng-data/voices/mb/mb-es4", start: 17507329, end: 17507417 }, { filename: "/espeak-ng-data/voices/mb/mb-fr1", start: 17507417, end: 17507583 }, { filename: "/espeak-ng-data/voices/mb/mb-fr1-en", start: 17507583, end: 17507687 }, { filename: "/espeak-ng-data/voices/mb/mb-fr2", start: 17507687, end: 17507790 }, { filename: "/espeak-ng-data/voices/mb/mb-fr3", start: 17507790, end: 17507890 }, { filename: "/espeak-ng-data/voices/mb/mb-fr4", start: 17507890, end: 17508017 }, { filename: "/espeak-ng-data/voices/mb/mb-fr4-en", start: 17508017, end: 17508124 }, { filename: "/espeak-ng-data/voices/mb/mb-fr5", start: 17508124, end: 17508224 }, { filename: "/espeak-ng-data/voices/mb/mb-fr6", start: 17508224, end: 17508324 }, { filename: "/espeak-ng-data/voices/mb/mb-fr7", start: 17508324, end: 17508407 }, { filename: "/espeak-ng-data/voices/mb/mb-gr1", start: 17508407, end: 17508501 }, { filename: "/espeak-ng-data/voices/mb/mb-gr2", start: 17508501, end: 17508595 }, { filename: "/espeak-ng-data/voices/mb/mb-gr2-en", start: 17508595, end: 17508683 }, { filename: "/espeak-ng-data/voices/mb/mb-hb1", start: 17508683, end: 17508751 }, { filename: "/espeak-ng-data/voices/mb/mb-hb2", start: 17508751, end: 17508834 }, { filename: "/espeak-ng-data/voices/mb/mb-hu1", start: 17508834, end: 17508936 }, { filename: "/espeak-ng-data/voices/mb/mb-hu1-en", start: 17508936, end: 17509033 }, { filename: "/espeak-ng-data/voices/mb/mb-ic1", start: 17509033, end: 17509121 }, { filename: "/espeak-ng-data/voices/mb/mb-id1", start: 17509121, end: 17509222 }, { filename: "/espeak-ng-data/voices/mb/mb-in1", start: 17509222, end: 17509291 }, { filename: "/espeak-ng-data/voices/mb/mb-in2", start: 17509291, end: 17509376 }, { filename: "/espeak-ng-data/voices/mb/mb-ir1", start: 17509376, end: 17510129 }, { filename: "/espeak-ng-data/voices/mb/mb-it1", start: 17510129, end: 17510213 }, { filename: "/espeak-ng-data/voices/mb/mb-it2", start: 17510213, end: 17510300 }, { filename: "/espeak-ng-data/voices/mb/mb-it3", start: 17510300, end: 17510442 }, { filename: "/espeak-ng-data/voices/mb/mb-it4", start: 17510442, end: 17510587 }, { filename: "/espeak-ng-data/voices/mb/mb-jp1", start: 17510587, end: 17510658 }, { filename: "/espeak-ng-data/voices/mb/mb-jp2", start: 17510658, end: 17510759 }, { filename: "/espeak-ng-data/voices/mb/mb-jp3", start: 17510759, end: 17510846 }, { filename: "/espeak-ng-data/voices/mb/mb-la1", start: 17510846, end: 17510929 }, { filename: "/espeak-ng-data/voices/mb/mb-lt1", start: 17510929, end: 17511016 }, { filename: "/espeak-ng-data/voices/mb/mb-lt2", start: 17511016, end: 17511103 }, { filename: "/espeak-ng-data/voices/mb/mb-ma1", start: 17511103, end: 17511201 }, { filename: "/espeak-ng-data/voices/mb/mb-mx1", start: 17511201, end: 17511321 }, { filename: "/espeak-ng-data/voices/mb/mb-mx2", start: 17511321, end: 17511441 }, { filename: "/espeak-ng-data/voices/mb/mb-nl1", start: 17511441, end: 17511510 }, { filename: "/espeak-ng-data/voices/mb/mb-nl2", start: 17511510, end: 17511606 }, { filename: "/espeak-ng-data/voices/mb/mb-nl2-en", start: 17511606, end: 17511697 }, { filename: "/espeak-ng-data/voices/mb/mb-nl3", start: 17511697, end: 17511782 }, { filename: "/espeak-ng-data/voices/mb/mb-nz1", start: 17511782, end: 17511850 }, { filename: "/espeak-ng-data/voices/mb/mb-pl1", start: 17511850, end: 17511949 }, { filename: "/espeak-ng-data/voices/mb/mb-pl1-en", start: 17511949, end: 17512031 }, { filename: "/espeak-ng-data/voices/mb/mb-pt1", start: 17512031, end: 17512162 }, { filename: "/espeak-ng-data/voices/mb/mb-ro1", start: 17512162, end: 17512249 }, { filename: "/espeak-ng-data/voices/mb/mb-ro1-en", start: 17512249, end: 17512330 }, { filename: "/espeak-ng-data/voices/mb/mb-sw1", start: 17512330, end: 17512428 }, { filename: "/espeak-ng-data/voices/mb/mb-sw1-en", start: 17512428, end: 17512521 }, { filename: "/espeak-ng-data/voices/mb/mb-sw2", start: 17512521, end: 17512623 }, { filename: "/espeak-ng-data/voices/mb/mb-sw2-en", start: 17512623, end: 17512722 }, { filename: "/espeak-ng-data/voices/mb/mb-tl1", start: 17512722, end: 17512807 }, { filename: "/espeak-ng-data/voices/mb/mb-tr1", start: 17512807, end: 17512892 }, { filename: "/espeak-ng-data/voices/mb/mb-tr2", start: 17512892, end: 17513006 }, { filename: "/espeak-ng-data/voices/mb/mb-us1", start: 17513006, end: 17513176 }, { filename: "/espeak-ng-data/voices/mb/mb-us2", start: 17513176, end: 17513354 }, { filename: "/espeak-ng-data/voices/mb/mb-us3", start: 17513354, end: 17513534 }, { filename: "/espeak-ng-data/voices/mb/mb-vz1", start: 17513534, end: 17513678 }, { filename: "/espeak-ng-data/yue_dict", start: 17513678, end: 18077249 }], remote_package_size: 18077249 });
      })();
      var Ge = Object.assign({}, l), Ne = [], he = "./this.program", Te = (e, a) => {
        throw a;
      }, M = "";
      function ba(e) {
        return l.locateFile ? l.locateFile(e, M) : M + e;
      }
      var _e, fe;
      if (ke) {
        var je = Re;
        M = __dirname + "/", fe = (e) => {
          e = ye(e) ? new URL(e) : e;
          var a = je.readFileSync(e);
          return a;
        }, _e = async (e, a = !0) => {
          e = ye(e) ? new URL(e) : e;
          var t = je.readFileSync(e, a ? void 0 : "utf8");
          return t;
        }, !l.thisProgram && process.argv.length > 1 && (he = process.argv[1].replace(/\\/g, "/")), Ne = process.argv.slice(2), Te = (e, a) => {
          throw process.exitCode = e, a;
        };
      } else (wa || ue) && (ue ? M = self.location.href : typeof document < "u" && document.currentScript && (M = document.currentScript.src), y && (M = y), M.startsWith("blob:") ? M = "" : M = M.substr(0, M.replace(/[?#].*/, "").lastIndexOf("/") + 1), ue && (fe = (e) => {
        var a = new XMLHttpRequest();
        return a.open("GET", e, !1), a.responseType = "arraybuffer", a.send(null), new Uint8Array(a.response);
      }), _e = async (e) => {
        if (ye(e))
          return new Promise((t, r) => {
            var s = new XMLHttpRequest();
            s.open("GET", e, !0), s.responseType = "arraybuffer", s.onload = () => {
              if (s.status == 200 || s.status == 0 && s.response) {
                t(s.response);
                return;
              }
              r(s.status);
            }, s.onerror = r, s.send(null);
          });
        var a = await fetch(e, { credentials: "same-origin" });
        if (a.ok)
          return a.arrayBuffer();
        throw new Error(a.status + " : " + a.url);
      });
      var Ce = l.print || console.log.bind(console), $ = l.printErr || console.error.bind(console);
      Object.assign(l, Ge), Ge = null, l.arguments && (Ne = l.arguments), l.thisProgram && (he = l.thisProgram);
      var we = l.wasmBinary, Ve, xe = !1, Oe, L, ne, me, h, A;
      function ya() {
        var e = Ve.buffer;
        l.HEAP8 = L = new Int8Array(e), l.HEAP16 = me = new Int16Array(e), l.HEAPU8 = ne = new Uint8Array(e), l.HEAPU16 = new Uint16Array(e), l.HEAP32 = h = new Int32Array(e), l.HEAPU32 = A = new Uint32Array(e), l.HEAPF32 = new Float32Array(e), l.HEAPF64 = new Float64Array(e);
      }
      var Ke = [], Xe = [], Ea = [], Je = [];
      function Sa() {
        if (l.preRun)
          for (typeof l.preRun == "function" && (l.preRun = [l.preRun]); l.preRun.length; )
            Aa(l.preRun.shift());
        Ee(Ke);
      }
      function Fa() {
        !l.noFSInit && !n.initialized && n.init(), n.ignorePermissions = !1, Ee(Xe);
      }
      function Pa() {
        Ee(Ea);
      }
      function Da() {
        if (l.postRun)
          for (typeof l.postRun == "function" && (l.postRun = [l.postRun]); l.postRun.length; )
            za(l.postRun.shift());
        Ee(Je);
      }
      function Aa(e) {
        Ke.unshift(e);
      }
      function Ra(e) {
        Xe.unshift(e);
      }
      function za(e) {
        Je.unshift(e);
      }
      var X = 0, ce = null;
      function Le(e) {
        var a;
        X++, (a = l.monitorRunDependencies) == null || a.call(l, X);
      }
      function be(e) {
        var t;
        if (X--, (t = l.monitorRunDependencies) == null || t.call(l, X), X == 0 && ce) {
          var a = ce;
          ce = null, a();
        }
      }
      function J(e) {
        var t;
        (t = l.onAbort) == null || t.call(l, e), e = "Aborted(" + e + ")", $(e), xe = !0, e += ". Build with -sASSERTIONS for more info.";
        var a = new WebAssembly.RuntimeError(e);
        throw te(a), a;
      }
      var Na = "data:application/octet-stream;base64,", Ye = (e) => e.startsWith(Na), ye = (e) => e.startsWith("file://");
      function Ta() {
        var e = "piper_phonemize.wasm";
        return Ye(e) ? e : ba(e);
      }
      var Ue;
      function ja(e) {
        if (e == Ue && we)
          return new Uint8Array(we);
        if (fe)
          return fe(e);
        throw "both async and sync fetching of the wasm failed";
      }
      async function Ca(e) {
        if (!we)
          try {
            var a = await _e(e);
            return new Uint8Array(a);
          } catch {
          }
        return ja(e);
      }
      async function xa(e, a) {
        try {
          var t = await Ca(e), r = await WebAssembly.instantiate(t, a);
          return r;
        } catch (s) {
          $(`failed to asynchronously prepare wasm: ${s}`), J(s);
        }
      }
      async function Oa(e, a, t) {
        if (!e && typeof WebAssembly.instantiateStreaming == "function" && !Ye(a) && !ye(a) && !ke && typeof fetch == "function")
          try {
            var r = fetch(a, { credentials: "same-origin" }), s = await WebAssembly.instantiateStreaming(r, t);
            return s;
          } catch (i) {
            $(`wasm streaming compile failed: ${i}`), $("falling back to ArrayBuffer instantiation");
          }
        return xa(a, t);
      }
      function La() {
        return { a: Nt };
      }
      async function Ua() {
        function e(s, i) {
          return de = s.exports, Ve = de.w, ya(), Ra(de.x), be(), de;
        }
        Le();
        function a(s) {
          e(s.instance);
        }
        var t = La();
        if (l.instantiateWasm)
          try {
            return l.instantiateWasm(t, e);
          } catch (s) {
            $(`Module.instantiateWasm callback failed with error: ${s}`), te(s);
          }
        Ue ?? (Ue = Ta());
        try {
          var r = await Oa(we, Ue, t);
          return a(r), r;
        } catch (s) {
          te(s);
          return;
        }
      }
      var g, P;
      class Ze {
        constructor(a) {
          I(this, "name", "ExitStatus");
          this.message = `Program terminated with exit(${a})`, this.status = a;
        }
      }
      var Ee = (e) => {
        for (; e.length > 0; )
          e.shift()(l);
      }, Ba = l.noExitRuntime || !0, Qe = typeof TextDecoder < "u" ? new TextDecoder() : void 0, re = (e, a = 0, t = NaN) => {
        for (var r = a + t, s = a; e[s] && !(s >= r); ) ++s;
        if (s - a > 16 && e.buffer && Qe)
          return Qe.decode(e.subarray(a, s));
        for (var i = ""; a < s; ) {
          var o = e[a++];
          if (!(o & 128)) {
            i += String.fromCharCode(o);
            continue;
          }
          var d = e[a++] & 63;
          if ((o & 224) == 192) {
            i += String.fromCharCode((o & 31) << 6 | d);
            continue;
          }
          var m = e[a++] & 63;
          if ((o & 240) == 224 ? o = (o & 15) << 12 | d << 6 | m : o = (o & 7) << 18 | d << 12 | m << 6 | e[a++] & 63, o < 65536)
            i += String.fromCharCode(o);
          else {
            var p = o - 65536;
            i += String.fromCharCode(55296 | p >> 10, 56320 | p & 1023);
          }
        }
        return i;
      }, Se = (e, a) => e ? re(ne, e, a) : "", Ma = (e, a, t, r) => J(`Assertion failed: ${Se(e)}, at: ` + [a ? Se(a) : "unknown filename", t, r ? Se(r) : "unknown function"]);
      class Ia {
        constructor(a) {
          this.excPtr = a, this.ptr = a - 24;
        }
        set_type(a) {
          A[this.ptr + 4 >> 2] = a;
        }
        get_type() {
          return A[this.ptr + 4 >> 2];
        }
        set_destructor(a) {
          A[this.ptr + 8 >> 2] = a;
        }
        get_destructor() {
          return A[this.ptr + 8 >> 2];
        }
        set_caught(a) {
          a = a ? 1 : 0, L[this.ptr + 12] = a;
        }
        get_caught() {
          return L[this.ptr + 12] != 0;
        }
        set_rethrown(a) {
          a = a ? 1 : 0, L[this.ptr + 13] = a;
        }
        get_rethrown() {
          return L[this.ptr + 13] != 0;
        }
        init(a, t) {
          this.set_adjusted_ptr(0), this.set_type(a), this.set_destructor(t);
        }
        set_adjusted_ptr(a) {
          A[this.ptr + 16 >> 2] = a;
        }
        get_adjusted_ptr() {
          return A[this.ptr + 16 >> 2];
        }
      }
      var ea = 0, qa = (e, a, t) => {
        var r = new Ia(e);
        throw r.init(a, t), ea = e, ea;
      }, Fe = () => {
        var e = h[+j.varargs >> 2];
        return j.varargs += 4, e;
      }, se = Fe, F = { isAbs: (e) => e.charAt(0) === "/", splitPath: (e) => {
        var a = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return a.exec(e).slice(1);
      }, normalizeArray: (e, a) => {
        for (var t = 0, r = e.length - 1; r >= 0; r--) {
          var s = e[r];
          s === "." ? e.splice(r, 1) : s === ".." ? (e.splice(r, 1), t++) : t && (e.splice(r, 1), t--);
        }
        if (a)
          for (; t; t--)
            e.unshift("..");
        return e;
      }, normalize: (e) => {
        var a = F.isAbs(e), t = e.substr(-1) === "/";
        return e = F.normalizeArray(e.split("/").filter((r) => !!r), !a).join("/"), !e && !a && (e = "."), e && t && (e += "/"), (a ? "/" : "") + e;
      }, dirname: (e) => {
        var a = F.splitPath(e), t = a[0], r = a[1];
        return !t && !r ? "." : (r && (r = r.substr(0, r.length - 1)), t + r);
      }, basename: (e) => {
        if (e === "/") return "/";
        e = F.normalize(e), e = e.replace(/\/$/, "");
        var a = e.lastIndexOf("/");
        return a === -1 ? e : e.substr(a + 1);
      }, join: (...e) => F.normalize(e.join("/")), join2: (e, a) => F.normalize(e + "/" + a) }, Ha = () => {
        if (typeof crypto == "object" && typeof crypto.getRandomValues == "function")
          return (r) => crypto.getRandomValues(r);
        if (ke)
          try {
            var e = Re || Lt, a = e.randomFillSync;
            if (a)
              return (r) => e.randomFillSync(r);
            var t = e.randomBytes;
            return (r) => (r.set(t(r.byteLength)), r);
          } catch {
          }
        J("initRandomDevice");
      }, aa = (e) => (aa = Ha())(e), ie = { resolve: (...e) => {
        for (var a = "", t = !1, r = e.length - 1; r >= -1 && !t; r--) {
          var s = r >= 0 ? e[r] : n.cwd();
          if (typeof s != "string")
            throw new TypeError("Arguments to path.resolve must be strings");
          if (!s)
            return "";
          a = s + "/" + a, t = F.isAbs(s);
        }
        return a = F.normalizeArray(a.split("/").filter((i) => !!i), !t).join("/"), (t ? "/" : "") + a || ".";
      }, relative: (e, a) => {
        e = ie.resolve(e).substr(1), a = ie.resolve(a).substr(1);
        function t(p) {
          for (var w = 0; w < p.length && p[w] === ""; w++)
            ;
          for (var k = p.length - 1; k >= 0 && p[k] === ""; k--)
            ;
          return w > k ? [] : p.slice(w, k - w + 1);
        }
        for (var r = t(e.split("/")), s = t(a.split("/")), i = Math.min(r.length, s.length), o = i, d = 0; d < i; d++)
          if (r[d] !== s[d]) {
            o = d;
            break;
          }
        for (var m = [], d = o; d < r.length; d++)
          m.push("..");
        return m = m.concat(s.slice(o)), m.join("/");
      } }, Be = [], Me = (e) => {
        for (var a = 0, t = 0; t < e.length; ++t) {
          var r = e.charCodeAt(t);
          r <= 127 ? a++ : r <= 2047 ? a += 2 : r >= 55296 && r <= 57343 ? (a += 4, ++t) : a += 3;
        }
        return a;
      }, Ie = (e, a, t, r) => {
        if (!(r > 0)) return 0;
        for (var s = t, i = t + r - 1, o = 0; o < e.length; ++o) {
          var d = e.charCodeAt(o);
          if (d >= 55296 && d <= 57343) {
            var m = e.charCodeAt(++o);
            d = 65536 + ((d & 1023) << 10) | m & 1023;
          }
          if (d <= 127) {
            if (t >= i) break;
            a[t++] = d;
          } else if (d <= 2047) {
            if (t + 1 >= i) break;
            a[t++] = 192 | d >> 6, a[t++] = 128 | d & 63;
          } else if (d <= 65535) {
            if (t + 2 >= i) break;
            a[t++] = 224 | d >> 12, a[t++] = 128 | d >> 6 & 63, a[t++] = 128 | d & 63;
          } else {
            if (t + 3 >= i) break;
            a[t++] = 240 | d >> 18, a[t++] = 128 | d >> 12 & 63, a[t++] = 128 | d >> 6 & 63, a[t++] = 128 | d & 63;
          }
        }
        return a[t] = 0, t - s;
      };
      function ta(e, a, t) {
        var r = Me(e) + 1, s = new Array(r), i = Ie(e, s, 0, s.length);
        return s.length = i, s;
      }
      var Wa = () => {
        if (!Be.length) {
          var e = null;
          if (ke) {
            var a = 256, t = Buffer.alloc(a), r = 0, s = process.stdin.fd;
            try {
              r = je.readSync(s, t, 0, a);
            } catch (i) {
              if (i.toString().includes("EOF")) r = 0;
              else throw i;
            }
            r > 0 && (e = t.slice(0, r).toString("utf-8"));
          } else typeof window < "u" && typeof window.prompt == "function" && (e = window.prompt("Input: "), e !== null && (e += `
`));
          if (!e)
            return null;
          Be = ta(e);
        }
        return Be.shift();
      }, Y = { ttys: [], init() {
      }, shutdown() {
      }, register(e, a) {
        Y.ttys[e] = { input: [], output: [], ops: a }, n.registerDevice(e, Y.stream_ops);
      }, stream_ops: { open(e) {
        var a = Y.ttys[e.node.rdev];
        if (!a)
          throw new n.ErrnoError(43);
        e.tty = a, e.seekable = !1;
      }, close(e) {
        e.tty.ops.fsync(e.tty);
      }, fsync(e) {
        e.tty.ops.fsync(e.tty);
      }, read(e, a, t, r, s) {
        if (!e.tty || !e.tty.ops.get_char)
          throw new n.ErrnoError(60);
        for (var i = 0, o = 0; o < r; o++) {
          var d;
          try {
            d = e.tty.ops.get_char(e.tty);
          } catch {
            throw new n.ErrnoError(29);
          }
          if (d === void 0 && i === 0)
            throw new n.ErrnoError(6);
          if (d == null) break;
          i++, a[t + o] = d;
        }
        return i && (e.node.atime = Date.now()), i;
      }, write(e, a, t, r, s) {
        if (!e.tty || !e.tty.ops.put_char)
          throw new n.ErrnoError(60);
        try {
          for (var i = 0; i < r; i++)
            e.tty.ops.put_char(e.tty, a[t + i]);
        } catch {
          throw new n.ErrnoError(29);
        }
        return r && (e.node.mtime = e.node.ctime = Date.now()), i;
      } }, default_tty_ops: { get_char(e) {
        return Wa();
      }, put_char(e, a) {
        a === null || a === 10 ? (Ce(re(e.output)), e.output = []) : a != 0 && e.output.push(a);
      }, fsync(e) {
        e.output && e.output.length > 0 && (Ce(re(e.output)), e.output = []);
      }, ioctl_tcgets(e) {
        return { c_iflag: 25856, c_oflag: 5, c_cflag: 191, c_lflag: 35387, c_cc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
      }, ioctl_tcsets(e, a, t) {
        return 0;
      }, ioctl_tiocgwinsz(e) {
        return [24, 80];
      } }, default_tty1_ops: { put_char(e, a) {
        a === null || a === 10 ? ($(re(e.output)), e.output = []) : a != 0 && e.output.push(a);
      }, fsync(e) {
        e.output && e.output.length > 0 && ($(re(e.output)), e.output = []);
      } } }, na = (e) => {
        J();
      }, u = { ops_table: null, mount(e) {
        return u.createNode(null, "/", 16895, 0);
      }, createNode(e, a, t, r) {
        if (n.isBlkdev(t) || n.isFIFO(t))
          throw new n.ErrnoError(63);
        u.ops_table || (u.ops_table = { dir: { node: { getattr: u.node_ops.getattr, setattr: u.node_ops.setattr, lookup: u.node_ops.lookup, mknod: u.node_ops.mknod, rename: u.node_ops.rename, unlink: u.node_ops.unlink, rmdir: u.node_ops.rmdir, readdir: u.node_ops.readdir, symlink: u.node_ops.symlink }, stream: { llseek: u.stream_ops.llseek } }, file: { node: { getattr: u.node_ops.getattr, setattr: u.node_ops.setattr }, stream: { llseek: u.stream_ops.llseek, read: u.stream_ops.read, write: u.stream_ops.write, allocate: u.stream_ops.allocate, mmap: u.stream_ops.mmap, msync: u.stream_ops.msync } }, link: { node: { getattr: u.node_ops.getattr, setattr: u.node_ops.setattr, readlink: u.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: u.node_ops.getattr, setattr: u.node_ops.setattr }, stream: n.chrdev_stream_ops } });
        var s = n.createNode(e, a, t, r);
        return n.isDir(s.mode) ? (s.node_ops = u.ops_table.dir.node, s.stream_ops = u.ops_table.dir.stream, s.contents = {}) : n.isFile(s.mode) ? (s.node_ops = u.ops_table.file.node, s.stream_ops = u.ops_table.file.stream, s.usedBytes = 0, s.contents = null) : n.isLink(s.mode) ? (s.node_ops = u.ops_table.link.node, s.stream_ops = u.ops_table.link.stream) : n.isChrdev(s.mode) && (s.node_ops = u.ops_table.chrdev.node, s.stream_ops = u.ops_table.chrdev.stream), s.atime = s.mtime = s.ctime = Date.now(), e && (e.contents[a] = s, e.atime = e.mtime = e.ctime = s.atime), s;
      }, getFileDataAsTypedArray(e) {
        return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array(0);
      }, expandFileStorage(e, a) {
        var t = e.contents ? e.contents.length : 0;
        if (!(t >= a)) {
          var r = 1024 * 1024;
          a = Math.max(a, t * (t < r ? 2 : 1.125) >>> 0), t != 0 && (a = Math.max(a, 256));
          var s = e.contents;
          e.contents = new Uint8Array(a), e.usedBytes > 0 && e.contents.set(s.subarray(0, e.usedBytes), 0);
        }
      }, resizeFileStorage(e, a) {
        if (e.usedBytes != a)
          if (a == 0)
            e.contents = null, e.usedBytes = 0;
          else {
            var t = e.contents;
            e.contents = new Uint8Array(a), t && e.contents.set(t.subarray(0, Math.min(a, e.usedBytes))), e.usedBytes = a;
          }
      }, node_ops: { getattr(e) {
        var a = {};
        return a.dev = n.isChrdev(e.mode) ? e.id : 1, a.ino = e.id, a.mode = e.mode, a.nlink = 1, a.uid = 0, a.gid = 0, a.rdev = e.rdev, n.isDir(e.mode) ? a.size = 4096 : n.isFile(e.mode) ? a.size = e.usedBytes : n.isLink(e.mode) ? a.size = e.link.length : a.size = 0, a.atime = new Date(e.atime), a.mtime = new Date(e.mtime), a.ctime = new Date(e.ctime), a.blksize = 4096, a.blocks = Math.ceil(a.size / a.blksize), a;
      }, setattr(e, a) {
        for (const t of ["mode", "atime", "mtime", "ctime"])
          a[t] && (e[t] = a[t]);
        a.size !== void 0 && u.resizeFileStorage(e, a.size);
      }, lookup(e, a) {
        throw u.doesNotExistError;
      }, mknod(e, a, t, r) {
        return u.createNode(e, a, t, r);
      }, rename(e, a, t) {
        var r;
        try {
          r = n.lookupNode(a, t);
        } catch {
        }
        if (r) {
          if (n.isDir(e.mode))
            for (var s in r.contents)
              throw new n.ErrnoError(55);
          n.hashRemoveNode(r);
        }
        delete e.parent.contents[e.name], a.contents[t] = e, e.name = t, a.ctime = a.mtime = e.parent.ctime = e.parent.mtime = Date.now();
      }, unlink(e, a) {
        delete e.contents[a], e.ctime = e.mtime = Date.now();
      }, rmdir(e, a) {
        var t = n.lookupNode(e, a);
        for (var r in t.contents)
          throw new n.ErrnoError(55);
        delete e.contents[a], e.ctime = e.mtime = Date.now();
      }, readdir(e) {
        return [".", "..", ...Object.keys(e.contents)];
      }, symlink(e, a, t) {
        var r = u.createNode(e, a, 41471, 0);
        return r.link = t, r;
      }, readlink(e) {
        if (!n.isLink(e.mode))
          throw new n.ErrnoError(28);
        return e.link;
      } }, stream_ops: { read(e, a, t, r, s) {
        var i = e.node.contents;
        if (s >= e.node.usedBytes) return 0;
        var o = Math.min(e.node.usedBytes - s, r);
        if (o > 8 && i.subarray)
          a.set(i.subarray(s, s + o), t);
        else
          for (var d = 0; d < o; d++) a[t + d] = i[s + d];
        return o;
      }, write(e, a, t, r, s, i) {
        if (!r) return 0;
        var o = e.node;
        if (o.mtime = o.ctime = Date.now(), a.subarray && (!o.contents || o.contents.subarray)) {
          if (i)
            return o.contents = a.subarray(t, t + r), o.usedBytes = r, r;
          if (o.usedBytes === 0 && s === 0)
            return o.contents = a.slice(t, t + r), o.usedBytes = r, r;
          if (s + r <= o.usedBytes)
            return o.contents.set(a.subarray(t, t + r), s), r;
        }
        if (u.expandFileStorage(o, s + r), o.contents.subarray && a.subarray)
          o.contents.set(a.subarray(t, t + r), s);
        else
          for (var d = 0; d < r; d++)
            o.contents[s + d] = a[t + d];
        return o.usedBytes = Math.max(o.usedBytes, s + r), r;
      }, llseek(e, a, t) {
        var r = a;
        if (t === 1 ? r += e.position : t === 2 && n.isFile(e.node.mode) && (r += e.node.usedBytes), r < 0)
          throw new n.ErrnoError(28);
        return r;
      }, allocate(e, a, t) {
        u.expandFileStorage(e.node, a + t), e.node.usedBytes = Math.max(e.node.usedBytes, a + t);
      }, mmap(e, a, t, r, s) {
        if (!n.isFile(e.node.mode))
          throw new n.ErrnoError(43);
        var i, o, d = e.node.contents;
        if (!(s & 2) && d && d.buffer === L.buffer)
          o = !1, i = d.byteOffset;
        else {
          if (o = !0, i = na(), !i)
            throw new n.ErrnoError(48);
          d && ((t > 0 || t + a < d.length) && (d.subarray ? d = d.subarray(t, t + a) : d = Array.prototype.slice.call(d, t, t + a)), L.set(d, i));
        }
        return { ptr: i, allocated: o };
      }, msync(e, a, t, r, s) {
        return u.stream_ops.write(e, a, 0, r, t, !1), 0;
      } } }, $a = async (e) => {
        var a = await _e(e);
        return new Uint8Array(a);
      }, ra = (e, a, t, r, s, i) => {
        n.createDataFile(e, a, t, r, s, i);
      }, Ga = l.preloadPlugins || [], Va = (e, a, t, r) => {
        typeof Browser < "u" && Browser.init();
        var s = !1;
        return Ga.forEach((i) => {
          s || i.canHandle(a) && (i.handle(e, a, t, r), s = !0);
        }), s;
      }, sa = (e, a, t, r, s, i, o, d, m, p) => {
        var w = a ? ie.resolve(F.join2(e, a)) : e;
        function k(_) {
          function c(f) {
            p == null || p(), d || ra(e, a, f, r, s, m), i == null || i(), be();
          }
          Va(_, w, c, () => {
            o == null || o(), be();
          }) || c(_);
        }
        Le(), typeof t == "string" ? $a(t).then(k, o) : k(t);
      }, Ka = (e) => {
        var a = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }, t = a[e];
        if (typeof t > "u")
          throw new Error(`Unknown file open mode: ${e}`);
        return t;
      }, qe = (e, a) => {
        var t = 0;
        return e && (t |= 365), a && (t |= 146), t;
      }, n = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: !1, ignorePermissions: !0, ErrnoError: class {
        constructor(e) {
          I(this, "name", "ErrnoError");
          this.errno = e;
        }
      }, filesystems: null, syncFSRequests: 0, readFiles: {}, FSStream: class {
        constructor() {
          I(this, "shared", {});
        }
        get object() {
          return this.node;
        }
        set object(e) {
          this.node = e;
        }
        get isRead() {
          return (this.flags & 2097155) !== 1;
        }
        get isWrite() {
          return (this.flags & 2097155) !== 0;
        }
        get isAppend() {
          return this.flags & 1024;
        }
        get flags() {
          return this.shared.flags;
        }
        set flags(e) {
          this.shared.flags = e;
        }
        get position() {
          return this.shared.position;
        }
        set position(e) {
          this.shared.position = e;
        }
      }, FSNode: class {
        constructor(e, a, t, r) {
          I(this, "node_ops", {});
          I(this, "stream_ops", {});
          I(this, "readMode", 365);
          I(this, "writeMode", 146);
          I(this, "mounted", null);
          e || (e = this), this.parent = e, this.mount = e.mount, this.id = n.nextInode++, this.name = a, this.mode = t, this.rdev = r, this.atime = this.mtime = this.ctime = Date.now();
        }
        get read() {
          return (this.mode & this.readMode) === this.readMode;
        }
        set read(e) {
          e ? this.mode |= this.readMode : this.mode &= ~this.readMode;
        }
        get write() {
          return (this.mode & this.writeMode) === this.writeMode;
        }
        set write(e) {
          e ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
        }
        get isFolder() {
          return n.isDir(this.mode);
        }
        get isDevice() {
          return n.isChrdev(this.mode);
        }
      }, lookupPath(e, a = {}) {
        if (!e) return { path: "", node: null };
        a.follow_mount ?? (a.follow_mount = !0), F.isAbs(e) || (e = n.cwd() + "/" + e);
        e: for (var t = 0; t < 40; t++) {
          for (var r = e.split("/").filter((p) => !!p && p !== "."), s = n.root, i = "/", o = 0; o < r.length; o++) {
            var d = o === r.length - 1;
            if (d && a.parent)
              break;
            if (r[o] === "..") {
              i = F.dirname(i), s = s.parent;
              continue;
            }
            i = F.join2(i, r[o]);
            try {
              s = n.lookupNode(s, r[o]);
            } catch (p) {
              if ((p == null ? void 0 : p.errno) === 44 && d && a.noent_okay)
                return { path: i };
              throw p;
            }
            if (n.isMountpoint(s) && (!d || a.follow_mount) && (s = s.mounted.root), n.isLink(s.mode) && (!d || a.follow)) {
              if (!s.node_ops.readlink)
                throw new n.ErrnoError(52);
              var m = s.node_ops.readlink(s);
              F.isAbs(m) || (m = F.dirname(i) + "/" + m), e = m + "/" + r.slice(o + 1).join("/");
              continue e;
            }
          }
          return { path: i, node: s };
        }
        throw new n.ErrnoError(32);
      }, getPath(e) {
        for (var a; ; ) {
          if (n.isRoot(e)) {
            var t = e.mount.mountpoint;
            return a ? t[t.length - 1] !== "/" ? `${t}/${a}` : t + a : t;
          }
          a = a ? `${e.name}/${a}` : e.name, e = e.parent;
        }
      }, hashName(e, a) {
        for (var t = 0, r = 0; r < a.length; r++)
          t = (t << 5) - t + a.charCodeAt(r) | 0;
        return (e + t >>> 0) % n.nameTable.length;
      }, hashAddNode(e) {
        var a = n.hashName(e.parent.id, e.name);
        e.name_next = n.nameTable[a], n.nameTable[a] = e;
      }, hashRemoveNode(e) {
        var a = n.hashName(e.parent.id, e.name);
        if (n.nameTable[a] === e)
          n.nameTable[a] = e.name_next;
        else
          for (var t = n.nameTable[a]; t; ) {
            if (t.name_next === e) {
              t.name_next = e.name_next;
              break;
            }
            t = t.name_next;
          }
      }, lookupNode(e, a) {
        var t = n.mayLookup(e);
        if (t)
          throw new n.ErrnoError(t);
        for (var r = n.hashName(e.id, a), s = n.nameTable[r]; s; s = s.name_next) {
          var i = s.name;
          if (s.parent.id === e.id && i === a)
            return s;
        }
        return n.lookup(e, a);
      }, createNode(e, a, t, r) {
        var s = new n.FSNode(e, a, t, r);
        return n.hashAddNode(s), s;
      }, destroyNode(e) {
        n.hashRemoveNode(e);
      }, isRoot(e) {
        return e === e.parent;
      }, isMountpoint(e) {
        return !!e.mounted;
      }, isFile(e) {
        return (e & 61440) === 32768;
      }, isDir(e) {
        return (e & 61440) === 16384;
      }, isLink(e) {
        return (e & 61440) === 40960;
      }, isChrdev(e) {
        return (e & 61440) === 8192;
      }, isBlkdev(e) {
        return (e & 61440) === 24576;
      }, isFIFO(e) {
        return (e & 61440) === 4096;
      }, isSocket(e) {
        return (e & 49152) === 49152;
      }, flagsToPermissionString(e) {
        var a = ["r", "w", "rw"][e & 3];
        return e & 512 && (a += "w"), a;
      }, nodePermissions(e, a) {
        return n.ignorePermissions ? 0 : a.includes("r") && !(e.mode & 292) || a.includes("w") && !(e.mode & 146) || a.includes("x") && !(e.mode & 73) ? 2 : 0;
      }, mayLookup(e) {
        if (!n.isDir(e.mode)) return 54;
        var a = n.nodePermissions(e, "x");
        return a || (e.node_ops.lookup ? 0 : 2);
      }, mayCreate(e, a) {
        if (!n.isDir(e.mode))
          return 54;
        try {
          var t = n.lookupNode(e, a);
          return 20;
        } catch {
        }
        return n.nodePermissions(e, "wx");
      }, mayDelete(e, a, t) {
        var r;
        try {
          r = n.lookupNode(e, a);
        } catch (i) {
          return i.errno;
        }
        var s = n.nodePermissions(e, "wx");
        if (s)
          return s;
        if (t) {
          if (!n.isDir(r.mode))
            return 54;
          if (n.isRoot(r) || n.getPath(r) === n.cwd())
            return 10;
        } else if (n.isDir(r.mode))
          return 31;
        return 0;
      }, mayOpen(e, a) {
        return e ? n.isLink(e.mode) ? 32 : n.isDir(e.mode) && (n.flagsToPermissionString(a) !== "r" || a & 512) ? 31 : n.nodePermissions(e, n.flagsToPermissionString(a)) : 44;
      }, MAX_OPEN_FDS: 4096, nextfd() {
        for (var e = 0; e <= n.MAX_OPEN_FDS; e++)
          if (!n.streams[e])
            return e;
        throw new n.ErrnoError(33);
      }, getStreamChecked(e) {
        var a = n.getStream(e);
        if (!a)
          throw new n.ErrnoError(8);
        return a;
      }, getStream: (e) => n.streams[e], createStream(e, a = -1) {
        return e = Object.assign(new n.FSStream(), e), a == -1 && (a = n.nextfd()), e.fd = a, n.streams[a] = e, e;
      }, closeStream(e) {
        n.streams[e] = null;
      }, dupStream(e, a = -1) {
        var r, s;
        var t = n.createStream(e, a);
        return (s = (r = t.stream_ops) == null ? void 0 : r.dup) == null || s.call(r, t), t;
      }, chrdev_stream_ops: { open(e) {
        var t, r;
        var a = n.getDevice(e.node.rdev);
        e.stream_ops = a.stream_ops, (r = (t = e.stream_ops).open) == null || r.call(t, e);
      }, llseek() {
        throw new n.ErrnoError(70);
      } }, major: (e) => e >> 8, minor: (e) => e & 255, makedev: (e, a) => e << 8 | a, registerDevice(e, a) {
        n.devices[e] = { stream_ops: a };
      }, getDevice: (e) => n.devices[e], getMounts(e) {
        for (var a = [], t = [e]; t.length; ) {
          var r = t.pop();
          a.push(r), t.push(...r.mounts);
        }
        return a;
      }, syncfs(e, a) {
        typeof e == "function" && (a = e, e = !1), n.syncFSRequests++, n.syncFSRequests > 1 && $(`warning: ${n.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
        var t = n.getMounts(n.root.mount), r = 0;
        function s(o) {
          return n.syncFSRequests--, a(o);
        }
        function i(o) {
          if (o)
            return i.errored ? void 0 : (i.errored = !0, s(o));
          ++r >= t.length && s(null);
        }
        t.forEach((o) => {
          if (!o.type.syncfs)
            return i(null);
          o.type.syncfs(o, e, i);
        });
      }, mount(e, a, t) {
        var r = t === "/", s = !t, i;
        if (r && n.root)
          throw new n.ErrnoError(10);
        if (!r && !s) {
          var o = n.lookupPath(t, { follow_mount: !1 });
          if (t = o.path, i = o.node, n.isMountpoint(i))
            throw new n.ErrnoError(10);
          if (!n.isDir(i.mode))
            throw new n.ErrnoError(54);
        }
        var d = { type: e, opts: a, mountpoint: t, mounts: [] }, m = e.mount(d);
        return m.mount = d, d.root = m, r ? n.root = m : i && (i.mounted = d, i.mount && i.mount.mounts.push(d)), m;
      }, unmount(e) {
        var a = n.lookupPath(e, { follow_mount: !1 });
        if (!n.isMountpoint(a.node))
          throw new n.ErrnoError(28);
        var t = a.node, r = t.mounted, s = n.getMounts(r);
        Object.keys(n.nameTable).forEach((o) => {
          for (var d = n.nameTable[o]; d; ) {
            var m = d.name_next;
            s.includes(d.mount) && n.destroyNode(d), d = m;
          }
        }), t.mounted = null;
        var i = t.mount.mounts.indexOf(r);
        t.mount.mounts.splice(i, 1);
      }, lookup(e, a) {
        return e.node_ops.lookup(e, a);
      }, mknod(e, a, t) {
        var r = n.lookupPath(e, { parent: !0 }), s = r.node, i = F.basename(e);
        if (!i || i === "." || i === "..")
          throw new n.ErrnoError(28);
        var o = n.mayCreate(s, i);
        if (o)
          throw new n.ErrnoError(o);
        if (!s.node_ops.mknod)
          throw new n.ErrnoError(63);
        return s.node_ops.mknod(s, i, a, t);
      }, statfs(e) {
        var a = { bsize: 4096, frsize: 4096, blocks: 1e6, bfree: 5e5, bavail: 5e5, files: n.nextInode, ffree: n.nextInode - 1, fsid: 42, flags: 2, namelen: 255 }, t = n.lookupPath(e, { follow: !0 }).node;
        return t != null && t.node_ops.statfs && Object.assign(a, t.node_ops.statfs(t.mount.opts.root)), a;
      }, create(e, a = 438) {
        return a &= 4095, a |= 32768, n.mknod(e, a, 0);
      }, mkdir(e, a = 511) {
        return a &= 1023, a |= 16384, n.mknod(e, a, 0);
      }, mkdirTree(e, a) {
        for (var t = e.split("/"), r = "", s = 0; s < t.length; ++s)
          if (t[s]) {
            r += "/" + t[s];
            try {
              n.mkdir(r, a);
            } catch (i) {
              if (i.errno != 20) throw i;
            }
          }
      }, mkdev(e, a, t) {
        return typeof t > "u" && (t = a, a = 438), a |= 8192, n.mknod(e, a, t);
      }, symlink(e, a) {
        if (!ie.resolve(e))
          throw new n.ErrnoError(44);
        var t = n.lookupPath(a, { parent: !0 }), r = t.node;
        if (!r)
          throw new n.ErrnoError(44);
        var s = F.basename(a), i = n.mayCreate(r, s);
        if (i)
          throw new n.ErrnoError(i);
        if (!r.node_ops.symlink)
          throw new n.ErrnoError(63);
        return r.node_ops.symlink(r, s, e);
      }, rename(e, a) {
        var t = F.dirname(e), r = F.dirname(a), s = F.basename(e), i = F.basename(a), o, d, m;
        if (o = n.lookupPath(e, { parent: !0 }), d = o.node, o = n.lookupPath(a, { parent: !0 }), m = o.node, !d || !m) throw new n.ErrnoError(44);
        if (d.mount !== m.mount)
          throw new n.ErrnoError(75);
        var p = n.lookupNode(d, s), w = ie.relative(e, r);
        if (w.charAt(0) !== ".")
          throw new n.ErrnoError(28);
        if (w = ie.relative(a, t), w.charAt(0) !== ".")
          throw new n.ErrnoError(55);
        var k;
        try {
          k = n.lookupNode(m, i);
        } catch {
        }
        if (p !== k) {
          var _ = n.isDir(p.mode), c = n.mayDelete(d, s, _);
          if (c)
            throw new n.ErrnoError(c);
          if (c = k ? n.mayDelete(m, i, _) : n.mayCreate(m, i), c)
            throw new n.ErrnoError(c);
          if (!d.node_ops.rename)
            throw new n.ErrnoError(63);
          if (n.isMountpoint(p) || k && n.isMountpoint(k))
            throw new n.ErrnoError(10);
          if (m !== d && (c = n.nodePermissions(d, "w"), c))
            throw new n.ErrnoError(c);
          n.hashRemoveNode(p);
          try {
            d.node_ops.rename(p, m, i), p.parent = m;
          } catch (f) {
            throw f;
          } finally {
            n.hashAddNode(p);
          }
        }
      }, rmdir(e) {
        var a = n.lookupPath(e, { parent: !0 }), t = a.node, r = F.basename(e), s = n.lookupNode(t, r), i = n.mayDelete(t, r, !0);
        if (i)
          throw new n.ErrnoError(i);
        if (!t.node_ops.rmdir)
          throw new n.ErrnoError(63);
        if (n.isMountpoint(s))
          throw new n.ErrnoError(10);
        t.node_ops.rmdir(t, r), n.destroyNode(s);
      }, readdir(e) {
        var a = n.lookupPath(e, { follow: !0 }), t = a.node;
        if (!t.node_ops.readdir)
          throw new n.ErrnoError(54);
        return t.node_ops.readdir(t);
      }, unlink(e) {
        var a = n.lookupPath(e, { parent: !0 }), t = a.node;
        if (!t)
          throw new n.ErrnoError(44);
        var r = F.basename(e), s = n.lookupNode(t, r), i = n.mayDelete(t, r, !1);
        if (i)
          throw new n.ErrnoError(i);
        if (!t.node_ops.unlink)
          throw new n.ErrnoError(63);
        if (n.isMountpoint(s))
          throw new n.ErrnoError(10);
        t.node_ops.unlink(t, r), n.destroyNode(s);
      }, readlink(e) {
        var a = n.lookupPath(e), t = a.node;
        if (!t)
          throw new n.ErrnoError(44);
        if (!t.node_ops.readlink)
          throw new n.ErrnoError(28);
        return t.node_ops.readlink(t);
      }, stat(e, a) {
        var t = n.lookupPath(e, { follow: !a }), r = t.node;
        if (!r)
          throw new n.ErrnoError(44);
        if (!r.node_ops.getattr)
          throw new n.ErrnoError(63);
        return r.node_ops.getattr(r);
      }, lstat(e) {
        return n.stat(e, !0);
      }, chmod(e, a, t) {
        var r;
        if (typeof e == "string") {
          var s = n.lookupPath(e, { follow: !t });
          r = s.node;
        } else
          r = e;
        if (!r.node_ops.setattr)
          throw new n.ErrnoError(63);
        r.node_ops.setattr(r, { mode: a & 4095 | r.mode & -4096, ctime: Date.now() });
      }, lchmod(e, a) {
        n.chmod(e, a, !0);
      }, fchmod(e, a) {
        var t = n.getStreamChecked(e);
        n.chmod(t.node, a);
      }, chown(e, a, t, r) {
        var s;
        if (typeof e == "string") {
          var i = n.lookupPath(e, { follow: !r });
          s = i.node;
        } else
          s = e;
        if (!s.node_ops.setattr)
          throw new n.ErrnoError(63);
        s.node_ops.setattr(s, { timestamp: Date.now() });
      }, lchown(e, a, t) {
        n.chown(e, a, t, !0);
      }, fchown(e, a, t) {
        var r = n.getStreamChecked(e);
        n.chown(r.node, a, t);
      }, truncate(e, a) {
        if (a < 0)
          throw new n.ErrnoError(28);
        var t;
        if (typeof e == "string") {
          var r = n.lookupPath(e, { follow: !0 });
          t = r.node;
        } else
          t = e;
        if (!t.node_ops.setattr)
          throw new n.ErrnoError(63);
        if (n.isDir(t.mode))
          throw new n.ErrnoError(31);
        if (!n.isFile(t.mode))
          throw new n.ErrnoError(28);
        var s = n.nodePermissions(t, "w");
        if (s)
          throw new n.ErrnoError(s);
        t.node_ops.setattr(t, { size: a, timestamp: Date.now() });
      }, ftruncate(e, a) {
        var t = n.getStreamChecked(e);
        if (!(t.flags & 2097155))
          throw new n.ErrnoError(28);
        n.truncate(t.node, a);
      }, utime(e, a, t) {
        var r = n.lookupPath(e, { follow: !0 }), s = r.node;
        s.node_ops.setattr(s, { atime: a, mtime: t });
      }, open(e, a, t = 438) {
        if (e === "")
          throw new n.ErrnoError(44);
        a = typeof a == "string" ? Ka(a) : a, a & 64 ? t = t & 4095 | 32768 : t = 0;
        var r;
        if (typeof e == "object")
          r = e;
        else {
          var s = n.lookupPath(e, { follow: !(a & 131072), noent_okay: !0 });
          r = s.node, e = s.path;
        }
        var i = !1;
        if (a & 64)
          if (r) {
            if (a & 128)
              throw new n.ErrnoError(20);
          } else
            r = n.mknod(e, t, 0), i = !0;
        if (!r)
          throw new n.ErrnoError(44);
        if (n.isChrdev(r.mode) && (a &= -513), a & 65536 && !n.isDir(r.mode))
          throw new n.ErrnoError(54);
        if (!i) {
          var o = n.mayOpen(r, a);
          if (o)
            throw new n.ErrnoError(o);
        }
        a & 512 && !i && n.truncate(r, 0), a &= -131713;
        var d = n.createStream({ node: r, path: n.getPath(r), flags: a, seekable: !0, position: 0, stream_ops: r.stream_ops, ungotten: [], error: !1 });
        return d.stream_ops.open && d.stream_ops.open(d), l.logReadFiles && !(a & 1) && (e in n.readFiles || (n.readFiles[e] = 1)), d;
      }, close(e) {
        if (n.isClosed(e))
          throw new n.ErrnoError(8);
        e.getdents && (e.getdents = null);
        try {
          e.stream_ops.close && e.stream_ops.close(e);
        } catch (a) {
          throw a;
        } finally {
          n.closeStream(e.fd);
        }
        e.fd = null;
      }, isClosed(e) {
        return e.fd === null;
      }, llseek(e, a, t) {
        if (n.isClosed(e))
          throw new n.ErrnoError(8);
        if (!e.seekable || !e.stream_ops.llseek)
          throw new n.ErrnoError(70);
        if (t != 0 && t != 1 && t != 2)
          throw new n.ErrnoError(28);
        return e.position = e.stream_ops.llseek(e, a, t), e.ungotten = [], e.position;
      }, read(e, a, t, r, s) {
        if (r < 0 || s < 0)
          throw new n.ErrnoError(28);
        if (n.isClosed(e))
          throw new n.ErrnoError(8);
        if ((e.flags & 2097155) === 1)
          throw new n.ErrnoError(8);
        if (n.isDir(e.node.mode))
          throw new n.ErrnoError(31);
        if (!e.stream_ops.read)
          throw new n.ErrnoError(28);
        var i = typeof s < "u";
        if (!i)
          s = e.position;
        else if (!e.seekable)
          throw new n.ErrnoError(70);
        var o = e.stream_ops.read(e, a, t, r, s);
        return i || (e.position += o), o;
      }, write(e, a, t, r, s, i) {
        if (r < 0 || s < 0)
          throw new n.ErrnoError(28);
        if (n.isClosed(e))
          throw new n.ErrnoError(8);
        if (!(e.flags & 2097155))
          throw new n.ErrnoError(8);
        if (n.isDir(e.node.mode))
          throw new n.ErrnoError(31);
        if (!e.stream_ops.write)
          throw new n.ErrnoError(28);
        e.seekable && e.flags & 1024 && n.llseek(e, 0, 2);
        var o = typeof s < "u";
        if (!o)
          s = e.position;
        else if (!e.seekable)
          throw new n.ErrnoError(70);
        var d = e.stream_ops.write(e, a, t, r, s, i);
        return o || (e.position += d), d;
      }, allocate(e, a, t) {
        if (n.isClosed(e))
          throw new n.ErrnoError(8);
        if (a < 0 || t <= 0)
          throw new n.ErrnoError(28);
        if (!(e.flags & 2097155))
          throw new n.ErrnoError(8);
        if (!n.isFile(e.node.mode) && !n.isDir(e.node.mode))
          throw new n.ErrnoError(43);
        if (!e.stream_ops.allocate)
          throw new n.ErrnoError(138);
        e.stream_ops.allocate(e, a, t);
      }, mmap(e, a, t, r, s) {
        if (r & 2 && !(s & 2) && (e.flags & 2097155) !== 2)
          throw new n.ErrnoError(2);
        if ((e.flags & 2097155) === 1)
          throw new n.ErrnoError(2);
        if (!e.stream_ops.mmap)
          throw new n.ErrnoError(43);
        if (!a)
          throw new n.ErrnoError(28);
        return e.stream_ops.mmap(e, a, t, r, s);
      }, msync(e, a, t, r, s) {
        return e.stream_ops.msync ? e.stream_ops.msync(e, a, t, r, s) : 0;
      }, ioctl(e, a, t) {
        if (!e.stream_ops.ioctl)
          throw new n.ErrnoError(59);
        return e.stream_ops.ioctl(e, a, t);
      }, readFile(e, a = {}) {
        if (a.flags = a.flags || 0, a.encoding = a.encoding || "binary", a.encoding !== "utf8" && a.encoding !== "binary")
          throw new Error(`Invalid encoding type "${a.encoding}"`);
        var t, r = n.open(e, a.flags), s = n.stat(e), i = s.size, o = new Uint8Array(i);
        return n.read(r, o, 0, i, 0), a.encoding === "utf8" ? t = re(o) : a.encoding === "binary" && (t = o), n.close(r), t;
      }, writeFile(e, a, t = {}) {
        t.flags = t.flags || 577;
        var r = n.open(e, t.flags, t.mode);
        if (typeof a == "string") {
          var s = new Uint8Array(Me(a) + 1), i = Ie(a, s, 0, s.length);
          n.write(r, s, 0, i, void 0, t.canOwn);
        } else if (ArrayBuffer.isView(a))
          n.write(r, a, 0, a.byteLength, void 0, t.canOwn);
        else
          throw new Error("Unsupported data type");
        n.close(r);
      }, cwd: () => n.currentPath, chdir(e) {
        var a = n.lookupPath(e, { follow: !0 });
        if (a.node === null)
          throw new n.ErrnoError(44);
        if (!n.isDir(a.node.mode))
          throw new n.ErrnoError(54);
        var t = n.nodePermissions(a.node, "x");
        if (t)
          throw new n.ErrnoError(t);
        n.currentPath = a.path;
      }, createDefaultDirectories() {
        n.mkdir("/tmp"), n.mkdir("/home"), n.mkdir("/home/web_user");
      }, createDefaultDevices() {
        n.mkdir("/dev"), n.registerDevice(n.makedev(1, 3), { read: () => 0, write: (r, s, i, o, d) => o, llseek: () => 0 }), n.mkdev("/dev/null", n.makedev(1, 3)), Y.register(n.makedev(5, 0), Y.default_tty_ops), Y.register(n.makedev(6, 0), Y.default_tty1_ops), n.mkdev("/dev/tty", n.makedev(5, 0)), n.mkdev("/dev/tty1", n.makedev(6, 0));
        var e = new Uint8Array(1024), a = 0, t = () => (a === 0 && (a = aa(e).byteLength), e[--a]);
        n.createDevice("/dev", "random", t), n.createDevice("/dev", "urandom", t), n.mkdir("/dev/shm"), n.mkdir("/dev/shm/tmp");
      }, createSpecialDirectories() {
        n.mkdir("/proc");
        var e = n.mkdir("/proc/self");
        n.mkdir("/proc/self/fd"), n.mount({ mount() {
          var a = n.createNode(e, "fd", 16895, 73);
          return a.stream_ops = { llseek: u.stream_ops.llseek }, a.node_ops = { lookup(t, r) {
            var s = +r, i = n.getStreamChecked(s), o = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: () => i.path }, id: s + 1 };
            return o.parent = o, o;
          }, readdir() {
            return Array.from(n.streams.entries()).filter(([t, r]) => r).map(([t, r]) => t.toString());
          } }, a;
        } }, {}, "/proc/self/fd");
      }, createStandardStreams(e, a, t) {
        e ? n.createDevice("/dev", "stdin", e) : n.symlink("/dev/tty", "/dev/stdin"), a ? n.createDevice("/dev", "stdout", null, a) : n.symlink("/dev/tty", "/dev/stdout"), t ? n.createDevice("/dev", "stderr", null, t) : n.symlink("/dev/tty1", "/dev/stderr"), n.open("/dev/stdin", 0), n.open("/dev/stdout", 1), n.open("/dev/stderr", 1);
      }, staticInit() {
        n.nameTable = new Array(4096), n.mount(u, {}, "/"), n.createDefaultDirectories(), n.createDefaultDevices(), n.createSpecialDirectories(), n.filesystems = { MEMFS: u };
      }, init(e, a, t) {
        n.initialized = !0, e ?? (e = l.stdin), a ?? (a = l.stdout), t ?? (t = l.stderr), n.createStandardStreams(e, a, t);
      }, quit() {
        n.initialized = !1;
        for (var e = 0; e < n.streams.length; e++) {
          var a = n.streams[e];
          a && n.close(a);
        }
      }, findObject(e, a) {
        var t = n.analyzePath(e, a);
        return t.exists ? t.object : null;
      }, analyzePath(e, a) {
        try {
          var t = n.lookupPath(e, { follow: !a });
          e = t.path;
        } catch {
        }
        var r = { isRoot: !1, exists: !1, error: 0, name: null, path: null, object: null, parentExists: !1, parentPath: null, parentObject: null };
        try {
          var t = n.lookupPath(e, { parent: !0 });
          r.parentExists = !0, r.parentPath = t.path, r.parentObject = t.node, r.name = F.basename(e), t = n.lookupPath(e, { follow: !a }), r.exists = !0, r.path = t.path, r.object = t.node, r.name = t.node.name, r.isRoot = t.path === "/";
        } catch (s) {
          r.error = s.errno;
        }
        return r;
      }, createPath(e, a, t, r) {
        e = typeof e == "string" ? e : n.getPath(e);
        for (var s = a.split("/").reverse(); s.length; ) {
          var i = s.pop();
          if (i) {
            var o = F.join2(e, i);
            try {
              n.mkdir(o);
            } catch {
            }
            e = o;
          }
        }
        return o;
      }, createFile(e, a, t, r, s) {
        var i = F.join2(typeof e == "string" ? e : n.getPath(e), a), o = qe(r, s);
        return n.create(i, o);
      }, createDataFile(e, a, t, r, s, i) {
        var o = a;
        e && (e = typeof e == "string" ? e : n.getPath(e), o = a ? F.join2(e, a) : e);
        var d = qe(r, s), m = n.create(o, d);
        if (t) {
          if (typeof t == "string") {
            for (var p = new Array(t.length), w = 0, k = t.length; w < k; ++w) p[w] = t.charCodeAt(w);
            t = p;
          }
          n.chmod(m, d | 146);
          var _ = n.open(m, 577);
          n.write(_, t, 0, t.length, 0, i), n.close(_), n.chmod(m, d);
        }
      }, createDevice(e, a, t, r) {
        var d;
        var s = F.join2(typeof e == "string" ? e : n.getPath(e), a), i = qe(!!t, !!r);
        (d = n.createDevice).major ?? (d.major = 64);
        var o = n.makedev(n.createDevice.major++, 0);
        return n.registerDevice(o, { open(m) {
          m.seekable = !1;
        }, close(m) {
          var p;
          (p = r == null ? void 0 : r.buffer) != null && p.length && r(10);
        }, read(m, p, w, k, _) {
          for (var c = 0, f = 0; f < k; f++) {
            var b;
            try {
              b = t();
            } catch {
              throw new n.ErrnoError(29);
            }
            if (b === void 0 && c === 0)
              throw new n.ErrnoError(6);
            if (b == null) break;
            c++, p[w + f] = b;
          }
          return c && (m.node.atime = Date.now()), c;
        }, write(m, p, w, k, _) {
          for (var c = 0; c < k; c++)
            try {
              r(p[w + c]);
            } catch {
              throw new n.ErrnoError(29);
            }
          return k && (m.node.mtime = m.node.ctime = Date.now()), c;
        } }), n.mkdev(s, i, o);
      }, forceLoadFile(e) {
        if (e.isDevice || e.isFolder || e.link || e.contents) return !0;
        if (typeof XMLHttpRequest < "u")
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        try {
          e.contents = fe(e.url), e.usedBytes = e.contents.length;
        } catch {
          throw new n.ErrnoError(29);
        }
      }, createLazyFile(e, a, t, r, s) {
        class i {
          constructor() {
            I(this, "lengthKnown", !1);
            I(this, "chunks", []);
          }
          get(c) {
            if (!(c > this.length - 1 || c < 0)) {
              var f = c % this.chunkSize, b = c / this.chunkSize | 0;
              return this.getter(b)[f];
            }
          }
          setDataGetter(c) {
            this.getter = c;
          }
          cacheLength() {
            var c = new XMLHttpRequest();
            if (c.open("HEAD", t, !1), c.send(null), !(c.status >= 200 && c.status < 300 || c.status === 304)) throw new Error("Couldn't load " + t + ". Status: " + c.status);
            var f = Number(c.getResponseHeader("Content-length")), b, z = (b = c.getResponseHeader("Accept-Ranges")) && b === "bytes", N = (b = c.getResponseHeader("Content-Encoding")) && b === "gzip", E = 1024 * 1024;
            z || (E = f);
            var C = (D, U) => {
              if (D > U) throw new Error("invalid range (" + D + ", " + U + ") or no bytes requested!");
              if (U > f - 1) throw new Error("only " + f + " bytes available! programmer error!");
              var R = new XMLHttpRequest();
              if (R.open("GET", t, !1), f !== E && R.setRequestHeader("Range", "bytes=" + D + "-" + U), R.responseType = "arraybuffer", R.overrideMimeType && R.overrideMimeType("text/plain; charset=x-user-defined"), R.send(null), !(R.status >= 200 && R.status < 300 || R.status === 304)) throw new Error("Couldn't load " + t + ". Status: " + R.status);
              return R.response !== void 0 ? new Uint8Array(R.response || []) : ta(R.responseText || "");
            }, T = this;
            T.setDataGetter((D) => {
              var U = D * E, R = (D + 1) * E - 1;
              if (R = Math.min(R, f - 1), typeof T.chunks[D] > "u" && (T.chunks[D] = C(U, R)), typeof T.chunks[D] > "u") throw new Error("doXHR failed!");
              return T.chunks[D];
            }), (N || !f) && (E = f = 1, f = this.getter(0).length, E = f, Ce("LazyFiles on gzip forces download of the whole file when length is accessed")), this._length = f, this._chunkSize = E, this.lengthKnown = !0;
          }
          get length() {
            return this.lengthKnown || this.cacheLength(), this._length;
          }
          get chunkSize() {
            return this.lengthKnown || this.cacheLength(), this._chunkSize;
          }
        }
        if (typeof XMLHttpRequest < "u") {
          if (!ue) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
          var o = new i(), d = { isDevice: !1, contents: o };
        } else
          var d = { isDevice: !1, url: t };
        var m = n.createFile(e, a, d, r, s);
        d.contents ? m.contents = d.contents : d.url && (m.contents = null, m.url = d.url), Object.defineProperties(m, { usedBytes: { get: function() {
          return this.contents.length;
        } } });
        var p = {}, w = Object.keys(m.stream_ops);
        w.forEach((_) => {
          var c = m.stream_ops[_];
          p[_] = (...f) => (n.forceLoadFile(m), c(...f));
        });
        function k(_, c, f, b, z) {
          var N = _.node.contents;
          if (z >= N.length) return 0;
          var E = Math.min(N.length - z, b);
          if (N.slice)
            for (var C = 0; C < E; C++)
              c[f + C] = N[z + C];
          else
            for (var C = 0; C < E; C++)
              c[f + C] = N.get(z + C);
          return E;
        }
        return p.read = (_, c, f, b, z) => (n.forceLoadFile(m), k(_, c, f, b, z)), p.mmap = (_, c, f, b, z) => {
          n.forceLoadFile(m);
          var N = na();
          if (!N)
            throw new n.ErrnoError(48);
          return k(_, L, N, c, f), { ptr: N, allocated: !0 };
        }, m.stream_ops = p, m;
      } }, j = { DEFAULT_POLLMASK: 5, calculateAt(e, a, t) {
        if (F.isAbs(a))
          return a;
        var r;
        if (e === -100)
          r = n.cwd();
        else {
          var s = j.getStreamFromFD(e);
          r = s.path;
        }
        if (a.length == 0) {
          if (!t)
            throw new n.ErrnoError(44);
          return r;
        }
        return r + "/" + a;
      }, doStat(e, a, t) {
        var r = e(a);
        h[t >> 2] = r.dev, h[t + 4 >> 2] = r.mode, A[t + 8 >> 2] = r.nlink, h[t + 12 >> 2] = r.uid, h[t + 16 >> 2] = r.gid, h[t + 20 >> 2] = r.rdev, P = [r.size >>> 0, (g = r.size, +Math.abs(g) >= 1 ? g > 0 ? +Math.floor(g / 4294967296) >>> 0 : ~~+Math.ceil((g - +(~~g >>> 0)) / 4294967296) >>> 0 : 0)], h[t + 24 >> 2] = P[0], h[t + 28 >> 2] = P[1], h[t + 32 >> 2] = 4096, h[t + 36 >> 2] = r.blocks;
        var s = r.atime.getTime(), i = r.mtime.getTime(), o = r.ctime.getTime();
        return P = [Math.floor(s / 1e3) >>> 0, (g = Math.floor(s / 1e3), +Math.abs(g) >= 1 ? g > 0 ? +Math.floor(g / 4294967296) >>> 0 : ~~+Math.ceil((g - +(~~g >>> 0)) / 4294967296) >>> 0 : 0)], h[t + 40 >> 2] = P[0], h[t + 44 >> 2] = P[1], A[t + 48 >> 2] = s % 1e3 * 1e3 * 1e3, P = [Math.floor(i / 1e3) >>> 0, (g = Math.floor(i / 1e3), +Math.abs(g) >= 1 ? g > 0 ? +Math.floor(g / 4294967296) >>> 0 : ~~+Math.ceil((g - +(~~g >>> 0)) / 4294967296) >>> 0 : 0)], h[t + 56 >> 2] = P[0], h[t + 60 >> 2] = P[1], A[t + 64 >> 2] = i % 1e3 * 1e3 * 1e3, P = [Math.floor(o / 1e3) >>> 0, (g = Math.floor(o / 1e3), +Math.abs(g) >= 1 ? g > 0 ? +Math.floor(g / 4294967296) >>> 0 : ~~+Math.ceil((g - +(~~g >>> 0)) / 4294967296) >>> 0 : 0)], h[t + 72 >> 2] = P[0], h[t + 76 >> 2] = P[1], A[t + 80 >> 2] = o % 1e3 * 1e3 * 1e3, P = [r.ino >>> 0, (g = r.ino, +Math.abs(g) >= 1 ? g > 0 ? +Math.floor(g / 4294967296) >>> 0 : ~~+Math.ceil((g - +(~~g >>> 0)) / 4294967296) >>> 0 : 0)], h[t + 88 >> 2] = P[0], h[t + 92 >> 2] = P[1], 0;
      }, doMsync(e, a, t, r, s) {
        if (!n.isFile(a.node.mode))
          throw new n.ErrnoError(43);
        if (r & 2)
          return 0;
        var i = ne.slice(e, e + t);
        n.msync(a, i, s, t, r);
      }, getStreamFromFD(e) {
        var a = n.getStreamChecked(e);
        return a;
      }, varargs: void 0, getStr(e) {
        var a = Se(e);
        return a;
      } };
      function Xa(e, a, t) {
        j.varargs = t;
        try {
          var r = j.getStreamFromFD(e);
          switch (a) {
            case 0: {
              var s = Fe();
              if (s < 0)
                return -28;
              for (; n.streams[s]; )
                s++;
              var i;
              return i = n.dupStream(r, s), i.fd;
            }
            case 1:
            case 2:
              return 0;
            case 3:
              return r.flags;
            case 4: {
              var s = Fe();
              return r.flags |= s, 0;
            }
            case 12: {
              var s = se(), o = 0;
              return me[s + o >> 1] = 2, 0;
            }
            case 13:
            case 14:
              return 0;
          }
          return -28;
        } catch (d) {
          if (typeof n > "u" || d.name !== "ErrnoError") throw d;
          return -d.errno;
        }
      }
      var oe = (e, a, t) => Ie(e, ne, a, t);
      function Ja(e, a, t) {
        try {
          var r = j.getStreamFromFD(e);
          r.getdents || (r.getdents = n.readdir(r.path));
          for (var s = 280, i = 0, o = n.llseek(r, 0, 1), d = Math.floor(o / s), m = Math.min(r.getdents.length, d + Math.floor(t / s)), p = d; p < m; p++) {
            var w, k, _ = r.getdents[p];
            if (_ === ".")
              w = r.node.id, k = 4;
            else if (_ === "..") {
              var c = n.lookupPath(r.path, { parent: !0 });
              w = c.node.id, k = 4;
            } else {
              var f;
              try {
                f = n.lookupNode(r.node, _);
              } catch (b) {
                if ((b == null ? void 0 : b.errno) === 28)
                  continue;
                throw b;
              }
              w = f.id, k = n.isChrdev(f.mode) ? 2 : n.isDir(f.mode) ? 4 : n.isLink(f.mode) ? 10 : 8;
            }
            P = [w >>> 0, (g = w, +Math.abs(g) >= 1 ? g > 0 ? +Math.floor(g / 4294967296) >>> 0 : ~~+Math.ceil((g - +(~~g >>> 0)) / 4294967296) >>> 0 : 0)], h[a + i >> 2] = P[0], h[a + i + 4 >> 2] = P[1], P = [(p + 1) * s >>> 0, (g = (p + 1) * s, +Math.abs(g) >= 1 ? g > 0 ? +Math.floor(g / 4294967296) >>> 0 : ~~+Math.ceil((g - +(~~g >>> 0)) / 4294967296) >>> 0 : 0)], h[a + i + 8 >> 2] = P[0], h[a + i + 12 >> 2] = P[1], me[a + i + 16 >> 1] = 280, L[a + i + 18] = k, oe(_, a + i + 19, 256), i += s;
          }
          return n.llseek(r, p * s, 0), i;
        } catch (b) {
          if (typeof n > "u" || b.name !== "ErrnoError") throw b;
          return -b.errno;
        }
      }
      function Ya(e, a, t) {
        j.varargs = t;
        try {
          var r = j.getStreamFromFD(e);
          switch (a) {
            case 21509:
              return r.tty ? 0 : -59;
            case 21505: {
              if (!r.tty) return -59;
              if (r.tty.ops.ioctl_tcgets) {
                var s = r.tty.ops.ioctl_tcgets(r), i = se();
                h[i >> 2] = s.c_iflag || 0, h[i + 4 >> 2] = s.c_oflag || 0, h[i + 8 >> 2] = s.c_cflag || 0, h[i + 12 >> 2] = s.c_lflag || 0;
                for (var o = 0; o < 32; o++)
                  L[i + o + 17] = s.c_cc[o] || 0;
                return 0;
              }
              return 0;
            }
            case 21510:
            case 21511:
            case 21512:
              return r.tty ? 0 : -59;
            case 21506:
            case 21507:
            case 21508: {
              if (!r.tty) return -59;
              if (r.tty.ops.ioctl_tcsets) {
                for (var i = se(), d = h[i >> 2], m = h[i + 4 >> 2], p = h[i + 8 >> 2], w = h[i + 12 >> 2], k = [], o = 0; o < 32; o++)
                  k.push(L[i + o + 17]);
                return r.tty.ops.ioctl_tcsets(r.tty, a, { c_iflag: d, c_oflag: m, c_cflag: p, c_lflag: w, c_cc: k });
              }
              return 0;
            }
            case 21519: {
              if (!r.tty) return -59;
              var i = se();
              return h[i >> 2] = 0, 0;
            }
            case 21520:
              return r.tty ? -28 : -59;
            case 21531: {
              var i = se();
              return n.ioctl(r, a, i);
            }
            case 21523: {
              if (!r.tty) return -59;
              if (r.tty.ops.ioctl_tiocgwinsz) {
                var _ = r.tty.ops.ioctl_tiocgwinsz(r.tty), i = se();
                me[i >> 1] = _[0], me[i + 2 >> 1] = _[1];
              }
              return 0;
            }
            case 21524:
              return r.tty ? 0 : -59;
            case 21515:
              return r.tty ? 0 : -59;
            default:
              return -28;
          }
        } catch (c) {
          if (typeof n > "u" || c.name !== "ErrnoError") throw c;
          return -c.errno;
        }
      }
      function Za(e, a, t, r) {
        j.varargs = r;
        try {
          a = j.getStr(a), a = j.calculateAt(e, a);
          var s = r ? Fe() : 0;
          return n.open(a, t, s).fd;
        } catch (i) {
          if (typeof n > "u" || i.name !== "ErrnoError") throw i;
          return -i.errno;
        }
      }
      function Qa(e) {
        try {
          return e = j.getStr(e), n.rmdir(e), 0;
        } catch (a) {
          if (typeof n > "u" || a.name !== "ErrnoError") throw a;
          return -a.errno;
        }
      }
      function et(e, a) {
        try {
          return e = j.getStr(e), j.doStat(n.stat, e, a);
        } catch (t) {
          if (typeof n > "u" || t.name !== "ErrnoError") throw t;
          return -t.errno;
        }
      }
      function at(e, a, t) {
        try {
          return a = j.getStr(a), a = j.calculateAt(e, a), t === 0 ? n.unlink(a) : t === 512 ? n.rmdir(a) : J("Invalid flags passed to unlinkat"), 0;
        } catch (r) {
          if (typeof n > "u" || r.name !== "ErrnoError") throw r;
          return -r.errno;
        }
      }
      var tt = () => J(""), nt = (e, a, t) => ne.copyWithin(e, a, a + t), rt = (e, a, t, r) => {
        var s = (/* @__PURE__ */ new Date()).getFullYear(), i = new Date(s, 0, 1), o = new Date(s, 6, 1), d = i.getTimezoneOffset(), m = o.getTimezoneOffset(), p = Math.max(d, m);
        A[e >> 2] = p * 60, h[a >> 2] = +(d != m);
        var w = (c) => {
          var f = c >= 0 ? "-" : "+", b = Math.abs(c), z = String(Math.floor(b / 60)).padStart(2, "0"), N = String(b % 60).padStart(2, "0");
          return `UTC${f}${z}${N}`;
        }, k = w(d), _ = w(m);
        m < d ? (oe(k, t, 17), oe(_, r, 17)) : (oe(k, r, 17), oe(_, t, 17));
      }, st = () => performance.now(), ia = () => Date.now(), it = (e) => e >= 0 && e <= 3, ot = (e, a) => a + 2097152 >>> 0 < 4194305 - !!e ? (e >>> 0) + a * 4294967296 : NaN;
      function dt(e, a, t, r) {
        if (!it(e))
          return 28;
        var s;
        e === 0 ? s = ia() : s = st();
        var i = Math.round(s * 1e3 * 1e3);
        return P = [i >>> 0, (g = i, +Math.abs(g) >= 1 ? g > 0 ? +Math.floor(g / 4294967296) >>> 0 : ~~+Math.ceil((g - +(~~g >>> 0)) / 4294967296) >>> 0 : 0)], h[r >> 2] = P[0], h[r + 4 >> 2] = P[1], 0;
      }
      var lt = (e) => {
        J("OOM");
      }, ft = (e) => {
        ne.length, lt();
      }, He = {}, mt = () => he || "./this.program", pe = () => {
        if (!pe.strings) {
          var e = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", a = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: e, _: mt() };
          for (var t in He)
            He[t] === void 0 ? delete a[t] : a[t] = He[t];
          var r = [];
          for (var t in a)
            r.push(`${t}=${a[t]}`);
          pe.strings = r;
        }
        return pe.strings;
      }, ct = (e, a) => {
        for (var t = 0; t < e.length; ++t)
          L[a++] = e.charCodeAt(t);
        L[a] = 0;
      }, pt = (e, a) => {
        var t = 0;
        return pe().forEach((r, s) => {
          var i = a + t;
          A[e + s * 4 >> 2] = i, ct(r, i), t += r.length + 1;
        }), 0;
      }, gt = (e, a) => {
        var t = pe();
        A[e >> 2] = t.length;
        var r = 0;
        return t.forEach((s) => r += s.length + 1), A[a >> 2] = r, 0;
      }, vt = 0, ut = () => Ba || vt > 0, kt = (e) => {
        var a;
        Oe = e, ut() || ((a = l.onExit) == null || a.call(l, e), xe = !0), Te(e, new Ze(e));
      }, oa = (e, a) => {
        Oe = e, kt(e);
      }, ht = oa;
      function _t(e) {
        try {
          var a = j.getStreamFromFD(e);
          return n.close(a), 0;
        } catch (t) {
          if (typeof n > "u" || t.name !== "ErrnoError") throw t;
          return t.errno;
        }
      }
      var wt = (e, a, t, r) => {
        for (var s = 0, i = 0; i < t; i++) {
          var o = A[a >> 2], d = A[a + 4 >> 2];
          a += 8;
          var m = n.read(e, L, o, d, r);
          if (m < 0) return -1;
          if (s += m, m < d) break;
        }
        return s;
      };
      function bt(e, a, t, r) {
        try {
          var s = j.getStreamFromFD(e), i = wt(s, a, t);
          return A[r >> 2] = i, 0;
        } catch (o) {
          if (typeof n > "u" || o.name !== "ErrnoError") throw o;
          return o.errno;
        }
      }
      function yt(e, a, t, r, s) {
        var i = ot(a, t);
        try {
          if (isNaN(i)) return 61;
          var o = j.getStreamFromFD(e);
          return n.llseek(o, i, r), P = [o.position >>> 0, (g = o.position, +Math.abs(g) >= 1 ? g > 0 ? +Math.floor(g / 4294967296) >>> 0 : ~~+Math.ceil((g - +(~~g >>> 0)) / 4294967296) >>> 0 : 0)], h[s >> 2] = P[0], h[s + 4 >> 2] = P[1], o.getdents && i === 0 && r === 0 && (o.getdents = null), 0;
        } catch (d) {
          if (typeof n > "u" || d.name !== "ErrnoError") throw d;
          return d.errno;
        }
      }
      var Et = (e, a, t, r) => {
        for (var s = 0, i = 0; i < t; i++) {
          var o = A[a >> 2], d = A[a + 4 >> 2];
          a += 8;
          var m = n.write(e, L, o, d, r);
          if (m < 0) return -1;
          if (s += m, m < d)
            break;
        }
        return s;
      };
      function St(e, a, t, r) {
        try {
          var s = j.getStreamFromFD(e), i = Et(s, a, t);
          return A[r >> 2] = i, 0;
        } catch (o) {
          if (typeof n > "u" || o.name !== "ErrnoError") throw o;
          return o.errno;
        }
      }
      var Ft = (e) => {
        if (e instanceof Ze || e == "unwind")
          return Oe;
        Te(1, e);
      }, da = (e) => fa(e), Pt = (e) => {
        var a = Me(e) + 1, t = da(a);
        return oe(e, t, a), t;
      }, Dt = n.createPath, At = (e) => n.unlink(e), Rt = n.createLazyFile, zt = n.createDevice;
      n.createPreloadedFile = sa, n.staticInit(), l.FS_createPath = n.createPath, l.FS_createDataFile = n.createDataFile, l.FS_createPreloadedFile = n.createPreloadedFile, l.FS_unlink = n.unlink, l.FS_createLazyFile = n.createLazyFile, l.FS_createDevice = n.createDevice, u.doesNotExistError = new n.ErrnoError(44), u.doesNotExistError.stack = "<generic error, no stack>";
      var Nt = { a: Ma, b: qa, e: Xa, s: Ja, h: Ya, f: Za, q: Qa, p: et, r: at, k: tt, j: nt, n: rt, l: dt, i: ia, o: ft, t: pt, u: gt, d: ht, c: _t, v: bt, m: yt, g: St }, de;
      Ua();
      var la = l._main = (e, a) => (la = l._main = de.y)(e, a), fa = (e) => (fa = de.A)(e);
      l.addRunDependency = Le, l.removeRunDependency = be, l.callMain = ma, l.FS_createPreloadedFile = sa, l.FS_unlink = At, l.FS_createPath = Dt, l.FS_createDevice = zt, l.FS = n, l.FS_createDataFile = ra, l.FS_createLazyFile = Rt;
      var Pe;
      ce = function e() {
        Pe || ca(), Pe || (ce = e);
      };
      function ma(e = []) {
        var a = la;
        e.unshift(he);
        var t = e.length, r = da((t + 1) * 4), s = r;
        e.forEach((o) => {
          A[s >> 2] = Pt(o), s += 4;
        }), A[s >> 2] = 0;
        try {
          var i = a(t, r);
          return oa(i, !0), i;
        } catch (o) {
          return Ft(o);
        }
      }
      function ca(e = Ne) {
        if (X > 0 || (Sa(), X > 0))
          return;
        function a() {
          var t;
          Pe || (Pe = !0, l.calledRun = !0, !xe && (Fa(), Pa(), q(l), (t = l.onRuntimeInitialized) == null || t.call(l), pa && ma(e), Da()));
        }
        l.setStatus ? (l.setStatus("Running..."), setTimeout(() => {
          setTimeout(() => l.setStatus(""), 1), a();
        }, 1)) : a();
      }
      if (l.preInit)
        for (typeof l.preInit == "function" && (l.preInit = [l.preInit]); l.preInit.length > 0; )
          l.preInit.pop()();
      var pa = !1;
      return l.noInitialRun && (pa = !1), ca(), O = ze, O;
    };
  })();
  typeof $e == "object" && typeof W == "object" ? (W.exports = We, W.exports.default = We) : typeof define == "function" && define.amd && define([], () => We);
  const Ut = (W.exports == null ? {} : W.exports).default || W.exports;
  var V;
  class Bt {
    constructor() {
      G(this, V, []);
    }
    destroy() {
      for (const v in x(this, V))
        typeof v == "string" && v.startsWith("blob:") && URL.revokeObjectURL(v);
      B(this, V, []);
    }
    async fetch(v) {
      return x(this, V)[v] ? Promise.resolve(x(this, V)[v]) : fetch(v).then(async (S) => {
        if (!S.ok)
          throw new Error("Could not fetch: " + v);
        return v.endsWith(".json") ? S.json() : URL.createObjectURL(await S.blob());
      }).then((S) => x(this, V)[v] = S);
    }
  }
  V = new WeakMap();
  var Z, le, Q, ee, ae, K;
  class Mt {
    constructor({ provider: v = new Bt(), basePath: S = "/piper/" } = {}) {
      G(this, Z, null);
      G(this, le, null);
      G(this, Q, null);
      G(this, ee, null);
      G(this, ae, null);
      G(this, K, null);
      B(this, Z, v), B(this, le, S);
    }
    destroy() {
      x(this, Z).destroy(), B(this, Q, null), B(this, ee, null), B(this, ae, null), B(this, K, null);
    }
    async loadModule(v = null, S = null) {
      return B(this, Q, v || x(this, Q) || await x(this, Z).fetch(x(this, le) + "piper_phonemize.wasm")), B(this, ee, S || x(this, ee) || await x(this, Z).fetch(x(this, le) + "piper_phonemize.data")), x(this, ae) || B(this, ae, await Ut({
        print: (O) => {
          x(this, K) && (x(this, K).call(this, JSON.parse(O)), B(this, K, null));
        },
        printErr: (O) => {
          throw new Error(O);
        },
        locateFile: (O, l) => O.endsWith(".wasm") ? x(this, Q) : O.endsWith(".data") ? x(this, ee) : O
      })), Promise.resolve(x(this, ae));
    }
    async phonemize(v, S) {
      const O = Object.fromEntries(Object.entries(S[0].phoneme_id_map).map(([l, q]) => [q[0], l]));
      return new Promise((l) => {
        B(this, K, (q) => {
          const te = q.phoneme_ids.map((ze) => O[ze]);
          l({
            ...q,
            phonemes: te
          });
        }), this.loadModule().then(
          (q) => q.callMain([
            "-l",
            S[0].espeak.voice,
            "--input",
            JSON.stringify([{ text: v }]),
            "--espeak_data",
            "/espeak-ng-data"
          ])
        );
      });
    }
  }
  Z = new WeakMap(), le = new WeakMap(), Q = new WeakMap(), ee = new WeakMap(), ae = new WeakMap(), K = new WeakMap();
  let Ae = null;
  self.onmessage = ({ data: { type: y, data: v } }) => {
    switch (y) {
      case "constructor":
        Ae = new Mt(v || {});
        break;
      case "destroy":
        Ae.destroy();
        break;
      case "loadModule":
        Ae.loadModule(...v || []).then(() => self.postMessage(null));
        break;
      case "phonemize":
        Ae.phonemize(...v || []).then(self.postMessage);
        break;
      default:
        throw new Error("Unknown type " + y);
    }
  };
});
export default It();
