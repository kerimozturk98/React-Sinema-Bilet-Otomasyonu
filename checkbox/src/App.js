import React, { Component } from 'react'
import axios from 'axios'
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import Tabs from "./components/tabs.js";
import makeAnimated from 'react-select/animated';
import "./App.css";
const animatedComponents = makeAnimated();
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      musteriler: [],
      select_musteriler: [],
      koltuklar: [],
      input_isim: "",
      input_soyisim: "",
      input_gsm: "",
      input_koltuk: [],
      select_koltuk: [],
      selected_koltuk: [],
      select_koltuk_option: [],
      put_name: "",
      put_surname: "",
      put_gsm: "",
      delete_rezerve_id : "",
      delete_name : "",
      delete_surname : "",
      delete_koltuk : [],
      silinen_koltuklar : []
    }
    this.getChair();
    this.getSelectChair();
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSurnameChange = this.handleSurnameChange.bind(this);
    this.handleGsmChange = this.handleGsmChange.bind(this);
    this.handleKoltukChange = this.handleKoltukChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    //this.handleSelectMusterilerChange = this.handleSelectMusterilerChange(this);
  }
  /** Rezervasyonları  bu fonks ile çekeriz */
  componentDidMount() {
    let mstr = [];
    axios.get("http://localhost:3000/musteri")
      .then(result => {
        result.data.forEach((result) => {
          let tmp = { value: result.id, label: result.ad + ' ' + result.soyad };
          mstr.push(tmp);
        })
        this.setState({
          musteriler: result.data,
          select_musteriler: mstr
        })
      }

      );
  }

  /**İlk Tabda müşteri ismi değiştiğinde */
  handleNameChange(event) {
    this.setState({ input_isim: event.target.value });

  }
  /**İlk Tabda müşteri soy ismi değiştiğinde */
  handleSurnameChange(event) {
    this.setState({ input_soyisim: event.target.value })
  }
  /**İlk Tabda gsm değiştiğinde */
  handleGsmChange(event) {
    this.setState({ input_gsm: event.target.value })
  }

  /**İlk Tabda koltuk seçimleri değiştiğinde */
  handleKoltukChange(event) {
    let koltuk = this.state.input_koltuk;
    /**Eğer koltuk seçilmiş ise state e atar
     * Eğer koltuk seçimi kaldırılmış ise state den çıkarır
     */
    if (event.target.checked) {
      koltuk.push(event.target.value);
      this.setState({ input_koltuk: koltuk })
    } else {
      var index = koltuk.indexOf(event.target.value);
      if (index !== -1) {
        koltuk.splice(index, 1);
        this.setState({ input_koltuk: koltuk });
      }
    }

  }

  /**Rezervasyon alınırken kullanılır */
  handleSubmit(event) {
    /**State de sadece koltukların id si tutulduğu için koltukların değerlerini alan kod */
    var koltuk_numara = [];
    for (var i = 0; i < this.state.input_koltuk.length; i++) {
      for (var y = 0; y < this.state.koltuklar.length; y++) {
        if (this.state.input_koltuk[i] == this.state.koltuklar[y].id) {
          koltuk_numara.push(this.state.koltuklar[y].value);
        }
      }
    }
    //console.log(koltuk_numara);

    /**Arkada herhangi bir back end fonksiyonu olmadığı için json a ekleyeceğimiz id yi kendimiz bildirmemiz gerekiyor
     * O yüzden böyle bir kod kullanıp en son eklenen id yi buluyoruz ve istek atarken onun bir fazlasını atıyoruz
     */
    let id;
    setTimeout(() => {
      axios.get('http://localhost:3000/musteri?_sort=id&_order=desc&_limit=1').then(result => { id = result.id });
    }, 100);
    /**Rezervasyon oluşturma isteği */
    setTimeout(() => {
      axios.post('http://localhost:3000/musteri', {
        'id': id + 1,
        'ad': this.state.input_isim,
        'soyad': this.state.input_soyisim,
        'gsm': this.state.input_gsm,
        'numara': koltuk_numara,
        "tutar": "30",
        "rez_tarihi": "2020/12/5",
        "seans": "15.30"
      });
    }, 3000);

    /**Eklenen koltuklar isSave true olarak ayarlanır */
    let koltuklar = this.state.koltuklar;
    this.state.input_koltuk.forEach((koltuk) => {
      let name;
      for (var i = 0; i < koltuklar.length; i++) {
        if (koltuklar[i].id == koltuk) {
          name = koltuklar[i].value;
        }
      }
      setTimeout(() => {
        axios.put('http://localhost:3000/koltuk/' + koltuk, {
          'id': koltuk,
          'isSave': true,
          'value': name
        });
      }, 4000);


    });
    setTimeout(() => {
      this.state.input_koltuk = [];
      this.state.input_isim = "";
      this.state.input_soyisim = "";
      this.state.input_gsm = "";
      this.getChair();
    }, 4000);
    alert("Başarılı");
  }
  
  /**İkinci Tabdaki rezervasyon seçildiğinde */
  handleChangeRezId = selectedOption => {
    let koltuk_tmp = [];
    this.state.musteriler.forEach((musteri) => {
      if (musteri.id == selectedOption.value) {
        koltuk_tmp.push(musteri.numara);
        this.setState({ put_name: musteri.ad });
        this.setState({ put_surname: musteri.soyad });
        this.setState({ put_gsm: musteri.gsm });
        this.setState({ put_id: musteri.id });
        this.setState({ put_koltuk: musteri.numara });
      }
    });
    let koltuk_tmp_2 = [];
    koltuk_tmp = koltuk_tmp[0];
    for (var i = 0; i < koltuk_tmp.length; i++) {
      for (var x = 0; x < this.state.koltuklar.length; x++) {
        if (koltuk_tmp[i].toString() === this.state.koltuklar[x].value.toString()) {
          koltuk_tmp_2.push({ "value": this.state.koltuklar[x].id, "label": this.state.koltuklar[x].value });
        }
      }
    }


    this.state.select_koltuk_option = this.state.select_koltuk;
    let option_tmp = [...this.state.select_koltuk_option, ...koltuk_tmp_2];

    this.setState({ select_koltuk_option: option_tmp }, () => {
      this.setState({ selected_koltuk: koltuk_tmp_2 }, () => {
        //console.log(this.state.selected_koltuk);
      });
    });




  };

  /**İkinci tabdaki rezervasyonun koltukları değiştiğinde */
  handleChangeRezKoltukId = selectedOption => {
    this.setState({ selected_koltuk: selectedOption });
  };

  /**Üçüncü tabdaki rezervasyon seçildiğinde */
  handleChangeDeleteRezerv = selectedOption => {
    this.setState({delete_rezerve_id:selectedOption.value});
    /**Sadece rez id si bildiğimiz için rezervasyon bilgilerini state den alır */
    let silinen_koltuklar = []
    for(var i=0;i<this.state.musteriler.length;i++)
    {
      //console.log(this.state.musteriler[i].id);
      if(this.state.musteriler[i].id === selectedOption.value)
      {
        this.setState({delete_name:this.state.musteriler[i].ad});
        this.setState({delete_surname:this.state.musteriler[i].soyad});
        this.setState({delete_koltuk:this.state.musteriler[i].numara});
        silinen_koltuklar = this.state.musteriler[i].numara
      }
    }
    /**O Silinen rezervasyondaki koltukların isSave değerini false yapar */
    let silinen_koltuk = [];
    for (var i = 0; i < silinen_koltuklar.length; i++) {
      for (var y = 0; y < this.state.koltuklar.length; y++) {
        if (silinen_koltuklar[i] === this.state.koltuklar[y].value) {
          silinen_koltuk.push({
            "id": this.state.koltuklar[y].id,
            "value": this.state.koltuklar[y].value,
            "isSave": false,
          });
        }
      }

    }
    this.setState({silinen_koltuklar:silinen_koltuk});
  }


  /**Güncelleme işlemi yapar */
  handlePutSubmit = event => {
    let name = document.getElementById('put_name').value;
    let sur_name = document.getElementById('put_surname').value;
    let gsm = document.getElementById('put_gsm').value;
    //let tmp = [{id:this.state.put_id},{ad:name.value},{soyad:sur_name.value},{gsm:gsm.value},{"numara":this.state.selected_koltuk},{"ilk koltuk":this.state.put_koltuk}];
    var silinen_koltuklar = [];
    let eklenen_koltuk = [];
    /**Silinen koltukları bulan kod */
    if (Array.isArray(this.state.selected_koltuk)) {
      for (var i = 0; i < this.state.put_koltuk.length; i++) {
        var isDelete = true;
        for (var y = 0; y < this.state.selected_koltuk.length; y++) {

          if (this.state.put_koltuk[i] === this.state.selected_koltuk[y].label) {
            isDelete = false;
          }
        }
        if (isDelete) {
          silinen_koltuklar.push(this.state.put_koltuk[i]);
        }

      }
      for (var y = 0; y < this.state.selected_koltuk.length; y++) {
        eklenen_koltuk.push(this.state.selected_koltuk[y].label);
      }
    } else {
      silinen_koltuklar = this.state.put_koltuk;
    }
    /**Silinen koltukları ayarlayan kod */
    for (var i = 0; i < silinen_koltuklar.length; i++) {
      for (var y = 0; y < this.state.koltuklar.length; y++) {
        if (silinen_koltuklar[i] == this.state.koltuklar[y].value) {
          silinen_koltuklar[i] = {
            "id": this.state.koltuklar[y].id,
            "value": this.state.koltuklar[y].value,
            "isSave": false
          };
        }
      }
    }
    /**Eklenen koltukları ayarlayan kod */
    let eklenen_koltuk_put = [];
    for (var i = 0; i < eklenen_koltuk.length; i++) {
      for (var y = 0; y < this.state.koltuklar.length; y++) {
        if (eklenen_koltuk[i] === this.state.koltuklar[y].value) {
          eklenen_koltuk_put.push({
            "id": this.state.koltuklar[y].id,
            "value": this.state.koltuklar[y].value,
            "isSave": true
          });
        }
      }

    }
   /**Koltukların isSave değerlerini json da güncelleyen kod */

    for (var i = 0; i < silinen_koltuklar.length; i++) {
      let id = silinen_koltuklar[i].id
      let tmp_sil = silinen_koltuklar[i];
      setTimeout(() => {
        axios.put("http://localhost:3000/koltuk/" + id, tmp_sil)
          .then(result => {
            //
          })
      }, 3000);
      //console.log(silinen_koltuklar[i].id);
    }
    for (var i = 0; i < eklenen_koltuk_put.length; i++) {
      let id = eklenen_koltuk_put[i].id
      let tmp_ekle = eklenen_koltuk_put[i];
      setTimeout(() => {
        axios.put("http://localhost:3000/koltuk/" + id, tmp_ekle)
          .then(result => {
            //
          })
      }, 3000);
      //console.log(silinen_koltuklar[i].id);
    }

    /**Rezervasyonu json server da değiştiren kod */
    setTimeout(() => {
      axios.put("http://localhost:3000/musteri/" + this.state.put_id, {
        "id": this.state.put_id,
        "ad": name,
        "soyad": sur_name,
        "gsm": gsm,
        "numara": eklenen_koltuk,
        "tutar": 30,
        "rez_tarihi": "2020/12/5",
        "seans": "15.30"
      })
        .then(result => {
          alert("Güncellendi");
        })
    }, 3000);
    //console.log(eklenen_koltuk);


  }

  /**Silinen Rezervasyon ile ilgili */
  handleDeleteSubmit = event => {
    setTimeout(() => {
      axios.delete("http://localhost:3000/musteri/" + this.state.delete_rezerve_id)
        .then(result => {
          //
        })
    }, 3000);
    /**Silinen koltukların  isSave değerini false yapar */
    for (var i = 0; i < this.state.silinen_koltuklar.length; i++) {
      let id = this.state.silinen_koltuklar[i].id
      let tmp_sil = this.state.silinen_koltuklar[i];
      setTimeout(() => {
        axios.put("http://localhost:3000/koltuk/" + id, tmp_sil)
          .then(result => {
            //
          })
      }, 3000);
      //console.log(silinen_koltuklar[i].id);
    }
    alert("Başarılı");
  }

  render() {
    return (
      <div className="container">
        <h1>Sinema Bilet Otomasyonu </h1>
        <Tabs>
          <div label="Bilet Al">
            <form>
              <div className="row">
                <div className="col">
                  <div className="col-md-4"></div>
                  <label htmlFor="name">İsim</label>
                  <input type="text" name="name" className="form-control" onChange={this.handleNameChange}></input>
                </div>

                <div className="col">
                  <label htmlFor="name">Soy isim</label>
                  <input type="text" name="sur_name" className="form-control" onChange={this.handleSurnameChange}></input>
                </div>
                <div className="col">
                  <label htmlFor="name">Gsm</label>
                  <input type="text" name="gsm" className="form-control" onChange={this.handleGsmChange}></input>
                </div>
              </div>
              <br></br>
              <div id="chairs" className="row">
                <h4>Koltuk Seçin</h4>
                <ul>
                  {
                    this.state.koltuklar.map((koltuk) => {
                      let disable = true
                      if (!koltuk.isSave) {
                        disable = false;
                      }
                      return (
                        <label key={koltuk.id}>
                          <input
                            type="checkbox"
                            value={koltuk.id}
                            //defaultChecked={this.state.i_agree}
                            disabled={disable}
                            onChange={this.handleKoltukChange}
                          />{koltuk.value}
                        </label>
                      )
                    })
                  }
                </ul>
              </div>
              <a className="btn btn-primary" id="bilet_alma" onClick={this.handleSubmit} >Kaydet</a>
            </form>
          </div>
          <div label="Bilet Düzenle">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Ad</th>
                  <th scope="col">Soyad</th>
                  <th scope="col">GSM</th>
                  <th scope="col">Koltuk</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.musteriler.map(bilgi => <div>{bilgi.id}</div>)}</td>
                  <td>{this.state.musteriler.map(bilgi => <div>{bilgi.ad}</div>)}</td>
                  <td>{this.state.musteriler.map(bilgi => <div>{bilgi.soyad}</div>)}</td>
                  <td>{this.state.musteriler.map(bilgi => <div>{bilgi.gsm}</div>)}</td>
                  <td>{this.state.musteriler.map(bilgi => <div>{bilgi.numara[0]} {bilgi.numara[1]} {bilgi.numara[2]}</div>)}</td>
                </tr>
              </tbody>
            </table>
            <div>
              <form>
                <h3>Rezervasyon Güncelleme</h3>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                  </div>

                </div>
                <label htmlFor="musteri">Güncellemek istediğiniz rezervasyonu seçiniz</label>
                <Select
                  //closeMenuOnSelect={false}
                  options={this.state.select_musteriler}
                  onChange={this.handleChangeRezId}
                />
                <br></br>
                <div className="input-group mb-3">

                  <input type="text" className="form-control" id="put_name" placeholder={this.state.put_name} />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                  </div>
                  <input type="text" className="form-control" id="put_surname" placeholder={this.state.put_surname} />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                  </div>
                  <input type="text" className="form-control" id="put_gsm" placeholder={this.state.put_gsm} />
                </div>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                  </div>

                </div>
                <Select
                  placeholder="Koltuk Seçilmedi"
                  isMulti
                  name="colors"
                  options={this.state.select_koltuk_option}
                  value={this.state.selected_koltuk}
                  onChange={this.handleChangeRezKoltukId}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
                <br></br>
                <a className="btn btn-primary" id="bilet_alma" onClick={this.handlePutSubmit}>Güncelle</a>
              </form>
            </div>

          </div>
          <div label="Bilet Sil">
            <div>
              <h3>Rezervasyon İptali</h3>
              <Select
                  //closeMenuOnSelect={false}
                  options={this.state.select_musteriler}
                  onChange={this.handleChangeDeleteRezerv}
                />
              <br />
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                </div>
                <label>{this.state.delete_name+' '+this.state.delete_surname}</label>
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                </div>
                <label>{this.state.delete_koltuk}</label>
              </div>
              <a className="btn btn-primary" onClick={this.handleDeleteSubmit} id="bilet_alma">Sil</a>
            </div>
          </div>
        </Tabs>
        <div>Serhat ÇİÇEK</div>
        <div>Kerim Öztürk</div>
        <div>İsmail Hakkı Baytak</div>
      </div >
    );
  }

  /**Tüm koltukları getirir */
  getChair() {
    setTimeout(() => {
      axios.get("http://localhost:3000/koltuk")
        .then(result =>
          this.setState({
            koltuklar: result.data,
          }),
        );
    }, 1000);
  }

  /**İKinci tabdaki select olduktan sonra o kullanıcının alabileceği koltukları getirir */
  getSelectChair() {
    let dizi = [];
    setTimeout(() => {
      axios.get("http://localhost:3000/koltuk?isSave=false")
        .then(result =>
          result.data.forEach((result) => {
            let tmp = { value: result.id, label: result.value };
            dizi.push(tmp);
          }));
    }, 200);
    this.state.select_koltuk = dizi;
    //console.log(this.state.select_koltuk);
  }


}
export default App;