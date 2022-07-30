import type { Message } from '@hi18n/core';
import { Book, Catalog, msg } from '@hi18n/core';

type Vocabulary = {
  'action/copy': Message;
  'action/run-all': Message;
  'action/copy-path': Message;

  'ui/provider/name': Message;
  'ui/provider/type': Message;
  'ui/provider/path': Message;

  'ui/common/save': Message;
  'ui/common/delete': Message;
  'ui/common/create from this template': Message;
  'ui/common/create': Message;
  'ui/common/default': Message;
};

const catalogEn = new Catalog<Vocabulary>({
  'action/copy': msg('copy'),
  'action/run-all': msg('run all'),
  'action/copy-path': msg('copy path'),

  'ui/provider/name': msg('name'),
  'ui/provider/type': msg('provider type'),
  'ui/provider/path': msg('local template path'),

  'ui/common/save': msg('save'),
  'ui/common/delete': msg('delete'),
  'ui/common/create from this template': msg('create from this template'),
  'ui/common/create': msg('create'),
  'ui/common/default': msg('default'),
});

const catalogJa = new Catalog<Vocabulary>({
  'action/copy': msg('コピー'),
  'action/run-all': msg('すべて実行'),
  'action/copy-path': msg('パスをコピー'),

  'ui/provider/name': msg('名前'),
  'ui/provider/type': msg('タイプ'),
  'ui/provider/path': msg('パス'),

  'ui/common/save': msg('保存'),
  'ui/common/delete': msg('削除'),
  'ui/common/create from this template': msg('このテンプレートから生成'),
  'ui/common/create': msg('作成'),
  'ui/common/default': msg('デフォルト'),
});

export const book = new Book<Vocabulary>({ en: catalogEn, ja: catalogJa });
