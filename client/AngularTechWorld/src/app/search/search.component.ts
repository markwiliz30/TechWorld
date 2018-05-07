import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  query: string;
  page = 1;

  content: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private data: DataService,
    private rest: RestApiService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.query = res['query'];
      this.getProducts();
    });
  }

  get lower() {
    return 10  * (this.page - 1) + 1;
  }

  get upper() {
    return Math.min( 10 * this.page, this.content.nbHits );
  }

  async getProducts(event?: any) {
    if (event) {
    this.content = null;
    }
    try {
      const data = await this.rest.get(
        `http://localhost:3030/api/search?query=${this.query}&page=${this.page -1}`
      );
      data['success']
        ? (this.content = data)
        : this.data.error(data['message']);
    } catch (error) {
      this.data.error(error['message']);
    }
  }

}
